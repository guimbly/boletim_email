"use client";
import { useState } from "react";
import FileUpload from "@/components/ui/FileUpload";
import Navbar from "@/components/Navbar";
import DownloadTemplate from "@/components/ui/DownloadTemplate";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastSuccess } from "@/components/ui/Toast";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showDownloadComponent, setShowDownloadComponent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const promise = new Promise<void>(resolve => setTimeout(()=> {
    setIsLoading(false);
    resolve();
  }, 50000))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    setIsLoading(true);

    if (!selectedFile) {
      alert("Por favor, selecione um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/generate-all-pdfs", {
        method: "POST",
        body: formData,
      });


      if (!response.ok) {
        const errorResponse = await response.json();
        alert(`Erro: ${errorResponse.error || 'Ocorreu um erro desconhecido'}`);
        return;
      }
      await promise;
      toastSuccess('Boletins Gerados com sucesso.')
      setIsLoading(false);

    } catch (error: any) {

      alert(`Erro de rede: ${error.message as string}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-full items-center justify-center text-center gap-5 md:p-10">

        {showDownloadComponent && <DownloadTemplate />}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full w-full items-center gap-4"
        >
          <FileUpload onFileUpload={setSelectedFile} setShowDownloadComponent={setShowDownloadComponent} handleClickGenerateButton={handleSubmit} isLoading={isLoading} />

        </form>
      </div>
    </>

  );
}
