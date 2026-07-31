'use strict';

const fs = require('fs').promises;
const path = require('path');

const LEADS_FILE_PATH = path.join(__dirname, 'leads.json');

const ValidationRules = {
  phone: /^[6-9]\d{9}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  name: /^[a-zA-Z][a-zA-Z\s.'-]{1,49}$/,
};

function normalizePhone(rawPhone) {
  if (!rawPhone) return '';

  let phone = String(rawPhone).trim().replace(/[\s\-()]/g, '');

  if (phone.startsWith('+91')) {
    phone = phone.slice(3);
  } else if (phone.startsWith('91') && phone.length === 12) {
    phone = phone.slice(2);
  } else if (phone.startsWith('0') && phone.length === 11) {
    phone = phone.slice(1);
  }

  return phone;
}

function validatePhone(rawPhone) {
  const phone = normalizePhone(rawPhone);

  if (!ValidationRules.phone.test(phone)) {
    return {
      valid: false,
      value: null,
      message: 'Please share a valid 10-digit Indian mobile number.',
    };
  }

  return {
    valid: true,
    value: phone,
    message: null,
  };
}

function validateEmail(rawEmail) {
  const email = String(rawEmail || '').trim().toLowerCase();

  if (!ValidationRules.email.test(email)) {
    return {
      valid: false,
      value: null,
      message: 'Please share a valid email address.',
    };
  }

  return {
    valid: true,
    value: email,
    message: null,
  };
}

function validateName(rawName) {
  const name = String(rawName || '').trim();

  if (!ValidationRules.name.test(name)) {
    return {
      valid: false,
      value: null,
      message: 'Please share your name using letters only, for example Rahul Sharma.',
    };
  }

  return {
    valid: true,
    value: name,
    message: null,
  };
}

class LeadRepository {
  async getAll() {
    throw new Error('Not implemented');
  }

  async getByPhone(phone) {
    throw new Error('Not implemented');
  }

  async upsert(phone, leadData) {
    throw new Error('Not implemented');
  }
}

class JSONFileLeadRepository extends LeadRepository {
  constructor(filePath = LEADS_FILE_PATH) {
    super();
    this.filePath = filePath;
    this.writeQueue = Promise.resolve();
  }

  async ensureFileExists() {
    try {
      await fs.access(this.filePath);
    } catch {
      await fs.writeFile(this.filePath, JSON.stringify({}, null, 2), 'utf-8');
    }
  }

  async getAll() {
    await this.ensureFileExists();

    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      return raw.trim() ? JSON.parse(raw) : {};
    } catch (error) {
      throw new Error(`Could not read leads.json: ${error.message}`);
    }
  }

  async getByPhone(phone) {
    const leads = await this.getAll();
    return leads[phone] || null;
  }

  async writeAll(leads) {
    console.log("Writing leads.json:", Object.keys(leads).length, "leads");
    const tempFile = `${this.filePath}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(leads, null, 2), 'utf-8');
    await fs.rename(tempFile, this.filePath);
  }

  async upsert(phone, leadData) {
    const task = async () => {
      const leads = await this.getAll();
      const existing = leads[phone];
      const incomingNotes = Array.isArray(leadData.notes) ? leadData.notes.filter(Boolean) : [];

      if (existing) {
        const mergedNotes = [...new Set([...(existing.notes || []), ...incomingNotes])];

        leads[phone] = {
          ...existing,
          name: existing.name || leadData.name || null,
          email: existing.email || leadData.email || null,
          interest: existing.interest || leadData.interest || null,
          notes: mergedNotes,
          source: existing.source || leadData.source || 'Website Chatbot',
          status: existing.status || leadData.status || 'New',
          updatedAt: new Date().toISOString(),
        };
      } else {
        leads[phone] = {
          name: leadData.name || null,
          email: leadData.email || null,
          createdAt: new Date().toISOString(),
          status: leadData.status || 'New',
          source: leadData.source || 'Website Chatbot',
          interest: leadData.interest || null,
          notes: incomingNotes,
        };
      }

      await this.writeAll(leads);
      return leads[phone];
    };

    const promise = this.writeQueue.catch(() => {}).then(task);
    this.writeQueue = promise.catch(() => {});
    return promise;
  }
}

const repository = new JSONFileLeadRepository();

async function saveLead({ phone, name, email, source, interest, notes }) {
  console.log("Saving lead:", { phone, name, email, source, interest, notes });
  let primaryKey = null;

  if (phone) {
    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) {
      return { success: false, message: phoneCheck.message };
    }
    primaryKey = phoneCheck.value;
  } else if (email) {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return { success: false, message: emailCheck.message };
    }
    primaryKey = emailCheck.value;
  } else {
    return { success: false, message: 'Phone or email is required.' };
  }

  if (name) {
    const nameCheck = validateName(name);
    if (!nameCheck.valid) {
      return { success: false, message: nameCheck.message };
    }
    name = nameCheck.value;
  }

  if (email && primaryKey !== email) {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return { success: false, message: emailCheck.message };
    }
    email = emailCheck.value;
  }

  try {
    const lead = await repository.upsert(primaryKey, {
      name,
      email,
      source,
      interest,
      notes,
    });
    
    console.log("Lead saved successfully.", primaryKey);

    return {
      success: true,
      phone: phone ? primaryKey : null,
      email: email ? email : null,
      lead,
    };
  } catch (error) {
    console.error('Failed to save lead:', error);
    return {
      success: false,
      message: `Could not save lead: ${error.message}`,
    };
  }
}

async function updateLead(phone, updates) {
  const phoneCheck = validatePhone(phone);

  if (!phoneCheck.valid) {
    return {
      success: false,
      message: phoneCheck.message,
    };
  }

  try {
    const existing = await repository.getByPhone(phoneCheck.value);

    if (!existing) {
      return {
        success: false,
        message: 'Lead not found.',
      };
    }

    const lead = await repository.upsert(phoneCheck.value, updates);
    return {
      success: true,
      lead,
    };
  } catch (error) {
    return {
      success: false,
      message: `Could not update lead: ${error.message}`,
    };
  }
}

async function getLead(phone) {
  const phoneCheck = validatePhone(phone);
  if (!phoneCheck.valid) return null;
  return repository.getByPhone(phoneCheck.value);
}

async function getAllLeads() {
  return repository.getAll();
}

module.exports = {
  saveLead,
  updateLead,
  getLead,
  getAllLeads,
  validatePhone,
  validateEmail,
  validateName,
  normalizePhone,
  JSONFileLeadRepository,
  LeadRepository,
};
