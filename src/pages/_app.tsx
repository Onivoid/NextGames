import "@/styles/globals.css";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css'; 
import type { AppProps } from "next/app";
import { PrimeReactProvider } from "primereact/api";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
}
