'use strict';

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

  if (!email || !ValidationRules.email.test(email)) {
    return {
      valid: false,
      value: null,
      message: 'Please provide a valid email address.',
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

  if (!name || name.length < 2) {
    return {
      valid: false,
      value: null,
      message: 'Name is too short. Please provide a valid name.',
    };
  }

  if (name.length > 50) {
    return {
      valid: false,
      value: null,
      message: 'Name is too long. Please provide a valid name.',
    };
  }

  if (!ValidationRules.name.test(name)) {
    return {
      valid: false,
      value: null,
      message: 'Please provide a valid name using letters and spaces.',
    };
  }

  return {
    valid: true,
    value: name,
    message: null,
  };
}

async function saveLead({ phone, name, email, source, interest, chat_summary, notes }) {
  let primaryKey = null;

  if (phone) {
    const phoneCheck = validatePhone(phone);
    if (!phoneCheck.valid) {
      return { success: false, message: phoneCheck.message };
    }
    primaryKey = phoneCheck.value;
    phone = phoneCheck.value;
  } else if (email) {
    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return { success: false, message: emailCheck.message };
    }
    primaryKey = emailCheck.value;
    email = emailCheck.value;
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
    const payload = {
      name: name || '',
      email: email || '',
      mobile: phone || '',
      interest: interest || '',
      chat_summary: chat_summary || '',
      source: source || 'Website Chatbot'
    };
    console.log("[STEP 3] Sending payload to Frappe");
    console.log(payload);

    const response = await fetch('http://127.0.0.1:8000/api/method/dhanada.api.create_chatbot_lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log("[STEP 4] Frappe response");

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error(`CRM API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(data);
    
    if (data.message && data.message.success) {
      console.log(`[STEP 5] CRM Lead Created`);
      console.log(`[CRM] Lead Created: ${data.message.lead_name}`);
      return {
        success: true,
        phone: phone ? primaryKey : null,
        email: email ? email : null,
        lead_name: data.message.lead_name,
      };
    } else {
      throw new Error(data._server_messages || "Unknown CRM API error");
    }

  } catch (error) {
    console.error('[CRM] Failed to save lead:', error.message);
    return {
      success: false,
      message: `Could not save lead: ${error.message}`,
    };
  }
}

async function updateLead({ lead_name, interest, chat_summary, email, phone }) {
  try {
    const payload = {
      lead_name,
      interest: interest || '',
      chat_summary: chat_summary || ''
    };
    if (email) payload.email = email;
    if (phone) payload.mobile_no = phone;
    console.log(`[STEP X] Updating lead ${lead_name} in Frappe`);
    
    const response = await fetch('http://127.0.0.1:8000/api/method/dhanada.api.update_chatbot_lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error(`CRM API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.message && data.message.success) {
      console.log(`[CRM] Lead Updated: ${data.message.lead_name}`);
      return { success: true, lead_name: data.message.lead_name };
    } else {
      throw new Error(data._server_messages || "Unknown CRM API error");
    }

  } catch (error) {
    console.error('[CRM] Failed to update lead:', error.message);
    return {
      success: false,
      message: `Could not update lead: ${error.message}`,
    };
  }
}

module.exports = {
  saveLead,
  updateLead,
  validatePhone,
  validateEmail,
  validateName,
  normalizePhone,
};
