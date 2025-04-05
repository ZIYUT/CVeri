import axios from 'axios';
import { ethers } from 'ethers';

export class PinataService {
  /**
   * 
   * @param {Object} resumeData 
   * @returns {Promise<{ipfsHash: string}>} - IPFS hash of the uploaded resume
   */
  static async uploadResumeToIPFS(resumeData) {
    try {
      const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
      const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
      
      // Check API keys
      if (!apiKey || !apiSecret) {
        console.error("API Keys:", apiKey ? "Key exists" : "No key", apiSecret ? "Secret exists" : "No secret");
        throw new Error('Pinata API keys not found in environment variables');
      }
        // Check resumeData
      const data = {
        ...resumeData,
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      });

      const ipfsHash = response.data.IpfsHash;
      return { ipfsHash };
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
      throw new Error(`Failed to upload resume: ${error.message}`);
    }
  }

  static async getResumeFromIPFS(cid) {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving from IPFS:', error);
      throw new Error(`Failed to get resume: ${error.message}`);
    }
  }
}
