import { useEffect, useState } from "react";

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // previne o prompt automático
      setDeferredPrompt(e); // salva o evento para disparar depois
      console.log("PWA pronto para instalar");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); // mostra o prompt de instalação
    const choice = await deferredPrompt.userChoice;
    console.log("Usuário escolheu:", choice.outcome);
    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null; // não mostrar botão se não houver prompt

  return <button onClick={handleInstall}>Instalar App</button>;
}
