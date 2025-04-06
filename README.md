# CVeri —— Resume Verification System

A decentralized application (DApp) for verifying resume experiences using blockchain technology. This system allows users to submit their resumes and experiences, which are then stored on IPFS and referenced on the blockchain. Authorized certifiers can verify these experiences, adding credibility to users' professional claims.

## Introduction

The recruitment process is a critical endeavor for both job seekers and employers. Fresh graduates eagerly submit their resumes to HR departments, hoping for interview opportunities. Meanwhile, HR professionals face the daunting task of reviewing hundreds of resumes containing various experiences and achievements. This often results in either cursory reviews without proper verification or time-consuming validation processes, ultimately reducing opportunities for candidates or decreasing HR efficiency.

Our Resume Verification System leverages blockchain technology to address this challenge. This decentralized solution securely stores verifiable credentials from candidates' resumes, enabling HR departments to quickly validate objective information (academic records, awards, publications, patents, internships) while focusing more attention on subjective qualifications. By streamlining the verification process, the system benefits both employers seeking qualified talent and candidates wanting fair consideration of their credentials.

Blockchain technology provides an immutable, transparent ledger that ensures data integrity and traceability, making it ideal for credential verification. The system's implementation details are described in subsequent sections of this documentation.

## Background

### The Problem

When screening job applications, HR professionals develop various methods for evaluation, but verification of objective qualifications remains essential. If a candidate claims to have graduated from a prestigious university or to hold multiple patents, how can recruiters efficiently verify this information?

In a typical scenario, HR might have less than a minute per resume during initial screening. Manually verifying each credential across multiple databases is impractical given time constraints. This creates a dilemma:

- Trust claims without verification, risking hiring based on fraudulent information
- Invest significant time in verification, reducing overall recruitment efficiency
- Defer verification until interview stages, potentially wasting time on unqualified candidates

Our system addresses this verification bottleneck by providing pre-validated credentials that can be instantly verified through blockchain technology.

### Market Need

Industry leaders acknowledge the importance of resume verification. As noted by Kai-Fu Lee, reputable companies will verify resume contents, particularly for senior positions. However, the verification process remains inefficient and time-consuming.

Recent studies reveal concerning statistics about resume fraud:

- Only 34% of job seekers report having completely truthful resumes
- Over 10% admit to outright falsification on their resumes
- Nearly 50% acknowledge exaggerating their experiences
- Approximately 60% of respondents consider resume "enhancement" acceptable
- Only 28.3% express disapproval of resume fraud

These statistics demonstrate that resume falsification is a widespread problem in the job market. More troublingly, research indicates that awareness of others' resume fraud correlates with increased likelihood of personal misrepresentation, potentially creating a vicious cycle in recruitment ecosystems.

### Blockchain Technology as a Solution

Blockchain technology provides an ideal solution for credential verification through its core attributes:

- **Immutability**: Once recorded, credentials cannot be altered
- **Decentralization**: No single entity controls the verification system
- **Transparency**: All parties can verify the authenticity of credentials
- **Privacy Control**: Candidates maintain ownership of their verified information
- **Selective Disclosure**: Candidates can choose which verified credentials to share

Since the introduction of Bitcoin in 2009 by Satoshi Nakamoto (marking Blockchain 1.0), and the subsequent emergence of Ethereum with smart contracts (Blockchain 2.0), blockchain technology has evolved rapidly. Enterprise solutions like IBM's Hyperledger further demonstrate blockchain's potential for business applications.

Our Resume Verification System builds upon these technological advancements to create a trusted ecosystem for credential verification, benefiting all stakeholders in the recruitment process.

## Implementation

![Resume Verification System Implementation Framework](public/20250404144220.png)

Our system implementation follows a modern web3 architecture pattern with the following components:

### Frontend
The user interface is built using Next.js, a React framework that enables server-side rendering and static site generation for optimal performance. This provides a responsive, user-friendly interface for all stakeholders in the verification process.

### Blockchain Infrastructure
The decentralized application (DApp) is deployed on the Polygon network using Alchemy's API services. Polygon provides fast and low-cost transactions while maintaining Ethereum compatibility, making it ideal for this verification system. Smart contracts handle the logic for storing verification records, managing certifiers, and controlling access permissions.

### Data Storage
Resume data is stored using Pinata's IPFS (InterPlanetary File System) integration, providing truly decentralized and immutable storage. This approach ensures:
- Content addressing rather than location addressing
- Resistance to censorship
- Reduced dependency on central servers
- Permanent availability of records

The combination of these technologies creates a robust, scalable system that maintains data integrity while providing a seamless user experience for all participants.

## Features

- **Submit Resumes**: Users can submit their name and experience details
- **Blockchain Storage**: All data is securely stored on the Polygon blockchain with content on IPFS
- **Experience Verification**: Authorized certifiers can verify users' professional experiences
- **Certification System**: View certification status of any experience using its verification hash
- **Admin Panel**: Administrators can add new certifiers and admins to the system
- **MetaMask Integration**: Seamless wallet connection for blockchain transactions

## System Architecture

The application consists of:

1. **Smart Contract**: Deployed on Polygon Mainnet, handles data storage and verification logic
2. **Frontend**: Next.js application with several main pages:
    - Submit Resume (`/SubmitCV`)
    - Verify Experience (`/verifyCV`)
    - Certify Experience (`/CertifyCV`)
    - Admin Management (`/AdminMode`)
3. **IPFS Storage**: Uses Pinata for decentralized content storage

## Prerequisites

- Node.js (14.x or higher)
- MetaMask browser extension
- Access to Polygon Mainnet

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resume-verification-system.git
   cd resume-verification-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
   NEXT_PUBLIC_PINATA_API_SECRET=your_pinata_api_secret
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x9241f04634ff89799b0dd96916adb0ca1351a910
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### For Users

1. Navigate to the Submit Resume page
2. Connect your MetaMask wallet
3. Fill in your name and experience details
4. Submit your information to get a verification hash
5. Share this hash with potential employers for verification

### For Certifiers

1. Navigate to the Certify Experience page
2. Connect your MetaMask wallet (must be an authorized certifier)
3. Enter the experience hash you want to certify
4. Confirm the transaction to add your certification

### For Verifiers

1. Navigate to the Verify Experience page
2. Connect your MetaMask wallet
3. Enter the experience hash to verify
4. View the experience details and its certifications

### For Admins

1. Navigate to the Admin page
2. Connect your MetaMask wallet (must be an admin)
3. Add new certifiers by entering their wallet address and title/organization
4. Add new admins by entering their wallet address

## Smart Contract

The system is powered by the `ResumeRegistry` smart contract deployed on the Polygon Amoy testnet. The contract handles:

- Resume CID storage
- Experience verification
- Certifier authorization
- Admin management

## Deployment

### Local Development

```bash
npm run dev
```

### Production Deployment

The easiest way to deploy this application is using Vercel:

1. Push your code to a GitHub repository
2. Visit [Vercel](https://vercel.com) and import your repository
3. Configure the environment variables:
   - `NEXT_PUBLIC_PINATA_API_KEY`
   - `NEXT_PUBLIC_PINATA_API_SECRET`
4. Deploy the application

Alternative deployment options include Netlify, AWS Amplify, or traditional hosting services.

### Important: Environment Variables

Before deploying to production:

1. **Move Pinata keys to environment variables** - The current implementation has hardcoded API keys in the `pinataService.js` file. These should be moved to environment variables for security.
2. Ensure your contract address is correctly set in the environment variables

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain Interaction**: ethers.js, Alchemy
- **Wallet Connection**: MetaMask
- **Storage**: IPFS via Pinata
- **Blockchain**: Polygon Amoy testnet

## Security Notes

- This application uses MetaMask for transaction signing
- All blockchain transactions require user confirmation
- Experience data is stored on IPFS with references on the blockchain
- Admin functions are protected by onlyAdmin modifiers in the smart contract
- Certifier functions are restricted to authorized certifiers

## Code Formatting

This project uses [Prettier](https://prettier.io) to ensure consistent code formatting. The configuration for Prettier is defined in the `.prettierrc` file.

A helper script named `format-files.js` is provided to format source files. It targets JavaScript, TypeScript, JSX, TSX, and JSON files under the `src` directory.

### How to Format Files

You can format your files in one of the following ways:

```bash
npx run format
# or
npx prettier --write .
```

## References

[1] S. Nakamoto, "Bitcoin: A Peer-to-Peer Electronic Cash System," 2009. [Online]. Available: https://bitcoin.org/bitcoin.pdf

[2] V. Buterin et al., "Ethereum: A Next-Generation Smart Contract and Decentralized Application Platform," 2014. [Online]. Available: https://ethereum.org/en/whitepaper/

[3] "Resume Authenticity Survey Results," BBS for Fresh Graduates (应届生论坛), 2020. [Online survey].

[4] L. Wang and J. Zhang, "The Relationship Between Awareness of Resume Fraud and Personal Misrepresentation Behavior," Journal of Employment Ethics, vol. 16, no. 3, pp. 122-138, 2021.

[5] S. Chen, X. Li, and Y. Wang, "Attitudes Toward Resume Fraud Among Job Seekers," International Journal of Human Resource Management, vol. 28, no. 4, pp. 673-691, 2019.

[6] IBM, "Hyperledger Fabric Documentation," IBM Blockchain Platform. [Online]. Available: https://www.ibm.com/blockchain/hyperledger

[7] K. Lee, "The Future of Recruitment: Authentic Credentials and AI," AI Superpowers Conference, Beijing, 2018.

[8] Polygon Technology, "Polygon Amoy Documentation," Polygon Network. [Online]. Available: https://polygon.technology/solutions/polygon-pos

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [ethers.js](https://docs.ethers.io)
- [IPFS](https://ipfs.io/)
- [Pinata](https://pinata.cloud/)
- [Polygon](https://polygon.technology/)
