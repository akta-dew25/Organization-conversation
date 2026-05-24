# SlackClone - DevCrew

A modern chat application built with React + Vite, featuring real-time messaging, channel management, groups, and direct messages.

## Features

- 🔐 **Authentication**: Login and registration with multi-step signup
- 💬 **Channels**: Create and manage public/private channels
- 👥 **Groups**: Team collaboration with group chats
- 📬 **Direct Messages**: One-on-one conversations
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Responsive**: Mobile-first design with sidebar drawer on mobile
- 🚀 **State Management**: Redux Toolkit for global state
- 🧩 **Component Library**: Radix UI + Custom components

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Radix UI
- **Routing**: React Router v6

## Project Structure

```
src/
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── DashboardLayout.jsx
│   ├── ChannelView.jsx
│   ├── DirectMessagesView.jsx
│   └── GroupsView.jsx
├── components/         # Reusable components
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── MessageList.jsx
│   ├── MessageInput.jsx
│   ├── ChannelHeader.jsx
│   ├── Modal.jsx
│   ├── CreateChannelModal.jsx
│   ├── AddMembersModal.jsx
│   └── NotificationCenter.jsx
├── redux/             # State management
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── channelsSlice.js
│       ├── messagesSlice.js
│       ├── groupsSlice.js
│       └── uiSlice.js
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Default Credentials (Demo)

- Email: `any@email.com`
- Password: `any`

### Building for Production

```bash
npm run build
```

This will create a `dist` folder with optimized production build.

### Preview Production Build

```bash
npm run preview
```

## Redux State Structure

```
{
  auth: {
    isAuthenticated: boolean,
    user: { id, name, email, avatar },
    organization: { id, name, slug },
    loading: boolean,
    error: string
  },
  channels: {
    channels: [],
    selectedChannelId: number,
    loading: boolean,
    error: string
  },
  messages: {
    messages: {},
    directMessages: {},
    loading: boolean,
    error: string
  },
  groups: {
    groups: [],
    selectedGroupId: number,
    loading: boolean,
    error: string
  },
  ui: {
    modals: {
      createChannel: boolean,
      addMembers: boolean,
      userProfile: boolean,
      settings: boolean
    },
    sidebarOpen: boolean,
    notifications: []
  }
}
```

## Key Features Explained

### Authentication

- Multi-step registration process
- Organization workspace setup
- Admin account creation
- Secure login and logout

### Channels

- Create public or private channels
- Browse all available channels
- Channel-specific messages
- Members management

### Direct Messages

- One-on-one conversations
- Group conversations
- Search and filter
- Message history

### Groups

- Team collaboration spaces
- Member management
- Group messaging
- Browse and join groups

### Responsive Design

- Mobile-first approach
- Sidebar drawer on mobile
- Touch-friendly buttons
- Optimized layouts for all devices

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Colors & Theme

Edit `tailwind.config.js` to customize colors and theme:

```js
theme: {
  extend: {
    colors: {
      primary: '#5f40d7',
      success: '#2ecc71',
      danger: '#e74c3c',
      warning: '#f39c12',
      // ...
    },
  },
}
```

### Adding New Features

1. Create Redux slice in `src/redux/slices/`
2. Add reducer to store
3. Create components in `src/components/`
4. Import and use in pages

## Future Enhancements

- [ ] WebSocket integration for real-time messaging
- [ ] File sharing and upload
- [ ] Mention and tagging (@username)
- [ ] Emoji picker
- [ ] Search and filters
- [ ] User profiles
- [ ] Settings and preferences
- [ ] Notification sounds
- [ ] Dark mode
- [ ] Message reactions
- [ ] Threading/Replies
- [ ] Message editing and deletion

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
