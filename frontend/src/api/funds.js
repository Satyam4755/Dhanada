export async function fetchFundsList() {
  try {
    const response = await fetch('/api/method/dhanada.api.get_funds_list');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    const data = result.message || result;
    if (data.status === 'success') {
      return data.data;
    } else {
      throw new Error(data.message || 'API returned an error');
    }
  } catch (error) {
    console.error("Failed to fetch funds:", error);
    throw error;
  }
}

export async function fetchFundDetails(identifier) {
  try {
    const response = await fetch(`/api/method/dhanada.api.get_fund_details?identifier=${encodeURIComponent(identifier)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    const data = result.message || result;
    if (data.status === 'success') {
      return data.data;
    } else {
      throw new Error(data.message || 'API returned an error');
    }
  } catch (error) {
    console.error("Failed to fetch fund details:", error);
    throw error;
  }
}
