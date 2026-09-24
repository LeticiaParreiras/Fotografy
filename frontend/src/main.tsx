import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";
import NiceModal from "@ebay/nice-modal-react";
import { ThemeProvider } from "./context/theme/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/Auth/AuthProvider";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NiceModal.Provider>
            <AuthProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
            </AuthProvider>
          </NiceModal.Provider>
        </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
