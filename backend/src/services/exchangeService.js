const axios = require('axios');

class ExchangeService {
  constructor() {
    this.apiKey = process.env.EXCHANGE_RATE_API_KEY;
    this.baseUrl = 'https://v6.exchangerate-api.com/v6';
  }

  async getLatestRates(baseCurrency) {
    if (!this.apiKey || this.apiKey.trim() === '' || this.apiKey === 'your_actual_api_key_here') {
      throw new Error('Configuration Error: EXCHANGE_RATE_API_KEY is missing or invalid in your .env file.');
    }

    try {
      // Construct the exact v6 In-URL format
      const url = `${this.baseUrl}/${this.apiKey.trim()}/latest/${baseCurrency}`;
      
      console.log(`[ExchangeService] Pinging external API for base: ${baseCurrency}`);
      
      const response = await axios.get(url);
      
      if (response.data && response.data.result === 'success') {
        return response.data.conversion_rates;
      }
      
      // Handle explicit API error structures
      const errorType = response.data ? response.data['error-type'] : 'unknown';
      throw new Error(`API rejected request with error-type: ${errorType}`);
      
    } catch (error) {
      if (error.response) {
        // Server responded with a status outside 2xx
        const status = error.response.status;
        const data = JSON.stringify(error.response.data);
        throw new Error(`Exchange API HTTP ${status}: ${data}`);
      }
      throw new Error(`Exchange Service Network Error: ${error.message}`);
    }
  }

  async convertCurrency(source, target, amount) {
    const rates = await this.getLatestRates(source);
    const rate = rates[target];
    
    if (!rate) {
      throw new Error(`Target currency ${target} not supported by the provider.`);
    }

    return {
      rate,
      result: amount * rate
    };
  }
}

module.exports = new ExchangeService();