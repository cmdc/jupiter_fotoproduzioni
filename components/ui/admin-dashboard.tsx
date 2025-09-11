"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Trash2, Upload, FolderOpen, Tag, X, Plus } from "lucide-react";

interface ImageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  tags: string[];
  folder: string;
  type: 'file' | 'folder';
  filePath: string;
  width?: number;
  height?: number;
  fileType?: string;
  uploadedAt: string;
}

interface Folder {
  name: string;
  path: string;
  imageCount: number;
}

interface AdminDashboardProps {
  authToken: string;
}

export default function AdminDashboard({ authToken }: AdminDashboardProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("/");
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [showTagModal, setShowTagModal] = useState(false);
  const [currentImageForTag, setCurrentImageForTag] = useState<string>("");
  const [newTag, setNewTag] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createAuthHeaders = () => ({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  });

  const createFormDataAuthHeaders = () => ({
    'Authorization': `Bearer ${authToken}`,
  });

  useEffect(() => {
    if (authToken) {
      loadImages();
      loadFolders();
    }
  }, [authToken]);

  const loadImages = async (path: string = currentPath) => {
    try {
      const params = new URLSearchParams({ path, limit: '100' });
      const response = await fetch(`/api/admin/images?${params}`, {
        headers: createAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
      }
    } catch (error) {
      console.error("Errore nel caricamento delle immagini:", error);
    }
  };

  const loadFolders = async (path: string = currentPath) => {
    try {
      const params = new URLSearchParams({ path });
      const response = await fetch(`/api/admin/folders?${params}`, {
        headers: createAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      } else if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.reload();
      }
    } catch (error) {
      console.error("Errore nel caricamento delle cartelle:", error);
    }
  };

  const handleFolderChange = async (folderPath: string) => {
    setCurrentPath(folderPath);
    setSelectedFolder(folderPath);
    await loadImages(folderPath);
    await loadFolders(folderPath);
  };

  const convertToWebP = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) {
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, ".webp"),
                  {
                    type: "image/webp",
                  }
                );
                resolve(webpFile);
              } else {
                reject(new Error("Conversione WebP fallita"));
              }
            },
            "image/webp",
            0.85
          );
        }

        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Errore nel caricamento immagine"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Il file ${file.name} supera i 5MB`);
        continue;
      }

      try {
        const webpFile = await convertToWebP(file);

        const formData = new FormData();
        formData.append("image", webpFile);
        formData.append("folder", currentPath);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: createFormDataAuthHeaders(),
          body: formData,
        });

        if (response.ok) {
          await loadImages();
          await loadFolders();
        } else {
          alert(`Errore nel caricamento di ${file.name}`);
        }
      } catch (error) {
        console.error(`Errore nella conversione di ${file.name}:`, error);
        alert(`Errore nella conversione di ${file.name}`);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return;

    if (!confirm(`Eliminare ${selectedImages.size} immagine/i?`)) return;

    try {
      const response = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: createAuthHeaders(),
        body: JSON.stringify({ fileIds: Array.from(selectedImages) }),
      });

      if (response.ok) {
        setSelectedImages(new Set());
        await loadImages();
        await loadFolders();
      } else {
        alert("Errore nell'eliminazione delle immagini");
      }
    } catch (error) {
      console.error("Errore nell'eliminazione:", error);
      alert("Errore nell'eliminazione delle immagini");
    }
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const openTagModal = (imageId: string) => {
    setCurrentImageForTag(imageId);
    setShowTagModal(true);
  };

  const addTag = async () => {
    if (!newTag.trim() || !currentImageForTag) return;

    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify({
          fileId: currentImageForTag,
          tags: [newTag.trim()],
        }),
      });

      if (response.ok) {
        setNewTag("");
        await loadImages();
      } else {
        alert("Errore nell'aggiunta del tag");
      }
    } catch (error) {
      console.error("Errore nell'aggiunta del tag:", error);
      alert("Errore nell'aggiunta del tag");
    }
  };

  const removeTag = async (imageId: string, tag: string) => {
    try {
      const response = await fetch("/api/admin/tags", {
        method: "DELETE",
        headers: createAuthHeaders(),
        body: JSON.stringify({ fileId: imageId, tag }),
      });

      if (response.ok) {
        await loadImages();
      } else {
        alert("Errore nella rimozione del tag");
      }
    } catch (error) {
      console.error("Errore nella rimozione del tag:", error);
      alert("Errore nella rimozione del tag");
    }
  };

  const handleDeploy = async () => {
    if (!confirm("Triggerare il deploy su Vercel? Vercel gestirà automaticamente build e deployment.")) return;

    setIsDeploying(true);

    try {
      const response = await fetch("/api/admin/deploy", {
        method: "POST",
        headers: createAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}\n\n${data.info || 'Controlla la dashboard di Vercel per monitorare il progresso.'}`);
        console.log("Deploy response:", data);
      } else {
        const errorData = await response.json();
        alert(`❌ ${errorData.message || 'Errore nel deploy'}\n\nDettagli: ${errorData.details || 'Errore sconosciuto'}`);
      }
    } catch (error) {
      console.error("Errore nel deploy:", error);
      alert("Errore nella comunicazione con il server");
    } finally {
      setIsDeploying(false);
    }
  };

  const filteredImages = images.filter(img => img.type === 'file');

  const currentImage = images.find((img) => img.id === currentImageForTag);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Upload Section */}
        <div className="rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upload Immagini</h2>
            <div className="flex gap-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Caricamento..." : "Carica Immagini"}
              </label>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className={`inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 ${
                  isDeploying ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title="Triggera deploy Vercel via webhook"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m37.5274 0 36.6253 65H.89009L37.5274 0Z" fill="currentColor"/>
                </svg>
                {isDeploying ? "Deploying..." : "Deploy Vercel"}
              </button>
            </div>
          </div>
        </div>

        {/* Path Navigation */}
        <div className="rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Percorso ImageKit: {currentPath}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleFolderChange("/")}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                currentPath === "/"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <FolderOpen className="w-4 h-4 mr-1" />
              Root
            </button>
            {currentPath !== "/" && (
              <button
                onClick={() => handleFolderChange(currentPath.split('/').slice(0, -1).join('/') || '/')}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                ← Indietro
              </button>
            )}
          </div>
          
          {/* Current folder contents */}
          <div className="flex flex-wrap gap-2">
            {images.filter(img => img.type === 'folder').map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleFolderChange(folder.filePath)}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              >
                <FolderOpen className="w-4 h-4 mr-1" />
                {folder.name}
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            File: {filteredImages.length} | Cartelle: {images.filter(img => img.type === 'folder').length}
          </div>
        </div>

        {/* Actions */}
        {selectedImages.size > 0 && (
          <div className="rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">
                {selectedImages.size} immagine/i selezionate
              </span>
              <button
                onClick={deleteSelectedImages}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Elimina Selezionate
              </button>
            </div>
          </div>
        )}

        {/* Images Grid */}
        <div className="rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            File ImageKit in {currentPath === "/" ? "Root" : currentPath}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`relative group border-2 rounded-lg overflow-hidden ${
                  selectedImages.has(image.id)
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
              >
                <div className="aspect-square relative">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={selectedImages.has(image.id)}
                        onChange={() => toggleImageSelection(image.id)}
                        className="w-4 h-4"
                        title="Seleziona immagine"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => openTagModal(image.id)}
                        className="p-1 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100"
                        title="Gestisci tag"
                      >
                        <Tag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <p className="text-xs text-gray-500">
                    {(image.size / 1024).toFixed(1)} KB
                  </p>
                  {image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tag Modal */}
        {showTagModal && currentImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Gestisci Tag</h3>
                <button
                  onClick={() => setShowTagModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Chiudi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {currentImage.name}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentImage.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(currentImage.id, tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        title="Cancella tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nuovo tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    title="Aggiungi tag"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
