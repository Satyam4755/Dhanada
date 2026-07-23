export async function fetchFundsList() {
  function extractNumericRisk(val) {
    if (val == null) return 'N/A';
    const match = String(val).match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num >= 1 && num <= 5) return num;
    }
    return 'N/A';
  }

  try {
    const response = await fetch('/api/method/dhanada.api.get_funds_list');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    const data = result.message || result;
    if (data.status === 'success') {
      return data.data.map(f => ({
        ...f,
        riskLevel: extractNumericRisk(f.risk)
      }));
    } else {
      throw new Error(data.message || 'API returned an error');
    }
  } catch (error) {
    console.error("Failed to fetch funds:", error);
    throw error;
  }
}

export async function fetchFundDetails(identifier) {
  function extractNumericRisk(val) {
    if (val == null) return 'N/A';
    const match = String(val).match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (num >= 1 && num <= 5) return num;
    }
    return 'N/A';
  }

  try {
    const response = await fetch(`/api/method/dhanada.api.get_fund_details?identifier=${encodeURIComponent(identifier)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    const data = result.message || result;
    if (data.status === 'success') {
      const fundData = data.data;
      return {
        ...fundData,
        riskLevel: extractNumericRisk(fundData.risk)
      };
    } else {
      throw new Error(data.message || 'API returned an error');
    }
  } catch (error) {
    console.error("Failed to fetch fund details:", error);
    throw error;
  }
}
