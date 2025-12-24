# Stacks TipJar

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF.svg)](https://vitejs.dev/)

A decentralized tipping application built on the Stacks blockchain, enabling users to send and receive micro-payments in STX tokens through an intuitive web interface.

![Connect](assets/connect.png)

## 🌟 Features

- **Decentralized Tipping**: Send tips directly on the blockchain without intermediaries
- **Wallet Integration**: Seamless connection with Stacks-compatible wallets (Hiro, Xverse, etc.)
- **Real-time Feed**: Live updates of tips and transactions
- **Responsive Design**: Optimized for desktop and mobile devices
- **Owner Dashboard**: Track earnings and manage your tip jar
- **Secure Transactions**: Built-in security with Stacks' smart contract capabilities

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React App] --> B[Vite Build Tool]
        A --> C[TypeScript]
        A --> D[Tailwind CSS]
        A --> E[Shadcn/UI Components]
    end

    subgraph "State Management"
        F[React Query] --> A
        G[Custom Hooks] --> A
        G --> H[useWallet]
        G --> I[useTips]
    end

    subgraph "Blockchain Layer"
        J[Stacks Connect] --> K[Wallet Integration]
        L[Stacks Transactions] --> M[Smart Contracts]
        N[Stacks Network] --> O[API Calls]
    end

    subgraph "UI Components"
        P[TipForm] --> Q[Transaction Creation]
        R[TipFeed] --> S[Real-time Updates]
        T[WalletButton] --> U[Connection Handling]
        V[OwnerPanel] --> W[Earnings Tracking]
    end

    A --> J
    A --> P
    K --> Q
    O --> S
    U --> K
    W --> O

    style A fill:#e1f5fe
    style J fill:#f3e5f5
    style P fill:#e8f5e8
```

### Component Architecture

The application follows a modular component architecture:

- **Pages**: Route-based page components (`Index`, `NotFound`)
- **Components**: Reusable UI components (forms, cards, buttons)
- **Hooks**: Custom React hooks for state and side effects
- **Lib**: Utility functions and blockchain interactions
- **UI**: Shadcn/ui component library integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Stacks-compatible wallet (Hiro Wallet recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stacks-tipjar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:8080`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage

### For Tippers

1. **Connect Wallet**: Click the "Connect Wallet" button and select your Stacks wallet
2. **Enter Tip Details**: Fill in the recipient's address and tip amount
3. **Send Tip**: Confirm the transaction in your wallet
4. **View Confirmation**: See your tip appear in the live feed

### For Recipients

1. **Set Up Your Tip Jar**: Connect your wallet to start receiving tips
2. **Share Your Address**: Share your Stacks address with supporters
3. **Monitor Earnings**: Use the owner panel to track received tips
4. **Withdraw Funds**: Transfer STX to your main wallet as needed

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and blockchain logic
├── pages/              # Route components
└── main.tsx            # Application entry point
```

### Key Technologies

- **Frontend Framework**: React 19.2.3 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui for consistent, accessible components
- **State Management**: TanStack Query for server state
- **Blockchain**: Stacks.js for wallet and transaction handling

### Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Environment Setup

The application uses the Stacks mainnet by default. For development:

1. Ensure your wallet is connected to the appropriate network
2. Test transactions use testnet STX (no real value)
3. Smart contracts are deployed on the configured network

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "Add your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Guidelines

- Follow the existing code style and conventions
- Write clear, concise commit messages
- Update documentation for any new features
- Ensure all tests pass before submitting
- Respect the MIT license terms

### Areas for Contribution

- UI/UX improvements
- Additional wallet integrations
- Smart contract enhancements
- Documentation improvements
- Performance optimizations
- Accessibility enhancements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Stacks Blockchain](https://stacks.co/)
- [Hiro Wallet](https://www.hiro.so/wallet)
- [Stacks.js Documentation](https://docs.stacks.co/)
- [Shadcn/ui](https://ui.shadcn.com/)

## 📞 Support

For questions, issues, or contributions:

- Open an issue on GitHub
- Join the Stacks Discord community
- Check the documentation for common solutions

---

Built with ❤️ on the Stacks blockchain
