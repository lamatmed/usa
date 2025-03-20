"use client";

import { useState, useEffect, useContext } from "react";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { createProduct, updateProduct, deleteProduct, getProducts } from "@/utils/actions";
import Uploader from "@/components/Uploader";
import { AuthContext } from "@/components/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = {
    id: string;
    name: string;
    quantity: number;
    price_v: number;
    imageUrl?: string | null;
    userId: string;
    user: {  // Add user details in the product object
      name: string;
      nni: string;
     
    };
  };
  interface AuthContextType {
    user: any; // Remplace 'any' par le type réel de ton utilisateur
    isAuthenticated: boolean;
  }
  
  
  export default function ManageProducts() {
   

    const authContext = (useContext(AuthContext) || {}) as AuthContextType;
    const { user, isAuthenticated } = authContext;

    
    
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
          router.replace("/login"); // Remplace l'historique pour éviter le retour en arrière
      }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price_v, setPriceV] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
    // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);




  
  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(
      data.map((product) => ({
        ...product,
        imageUrl: product.imageUrl ?? "", // Remplace null par une chaîne vide
        user: {
          name: product.user?.name ?? "User Name", // Nom par défaut si null
          nni: product.user?.nni ?? "User NNI", // NNI par défaut si null
        },
      }))
    );
  };
  
  useEffect(() => {
    loadProducts(); // ✅ Fonction bien déclarée avant utilisation
  }, []);
  
      
      
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
      const handleAddOrUpdateProduct = async () => {
        if (!isAuthenticated || !user) {
          Swal.fire({
            icon: "error",
            title: "Utilisateur non identifié",
            text: "Veuillez vous connecter.",
            background: "#1e293b", // Fond sombre
            color: "#f8fafc", // Texte clair
            iconColor: "#e11d48", // Icône rouge vif
            confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
            customClass: {
              popup: "rounded-lg shadow-lg", // Style général
              title: "text-lg font-bold text-white", // Style du titre
              confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
            }
          });
          
          return;
        }
      
        if (!name || !quantity || !price_v) {
          Swal.fire({ icon: "warning", title: "Champs manquants", text: "Remplissez tous les champs !" ,
            background: "#1e293b", // Fond sombre
            color: "#f8fafc", // Texte clair
            iconColor: "#e11d48", // Icône rouge vif
            confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
            customClass: {
              popup: "rounded-lg shadow-lg", // Style général
              title: "text-lg font-bold text-white", // Style du titre
              confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
            }
          });
          return;
        }
      
        if (parseInt(quantity) < 0 || parseFloat(price_v) <= 0) {
          Swal.fire({ icon: "error", title: "Valeur invalide", text: "Valeurs incorrectes !" });
          return;
        }
      
        try {
          Swal.fire({
            title: editingProduct ? "Mettre à jour ce produit ?" : "Ajouter ce produit ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Annuler",
            background: "#1e293b", // Fond sombre
            color: "#f8fafc", // Texte clair
            iconColor: "#e11d48", // Icône rouge vif
            confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
            customClass: {
              popup: "rounded-lg shadow-lg", // Style général
              title: "text-lg font-bold text-white", // Style du titre
              confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
            }
            
          }).then(async (result) => {
            if (!result.isConfirmed) return;
      
            Swal.fire({
              title: "Traitement...",
              allowOutsideClick: false,
              didOpen: () => {
                  Swal.showLoading(Swal.getConfirmButton()); // Utilisation correcte
              }
          });
          
      
            if (editingProduct) {
              // ✅ Mise à jour d'un produit
              const product = products.find(p => p.id === editingProduct.id); // Récupérer le produit à mettre à jour
              if (!product) {
                Swal.fire({ icon: 'error', title: 'Produit introuvable', text: 'Le produit à mettre à jour n\'existe pas.',
                  background: "#1e293b", // Fond sombre
                  color: "#f8fafc", // Texte clair
                  iconColor: "#e11d48", // Icône rouge vif
                  confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
                  customClass: {
                    popup: "rounded-lg shadow-lg", // Style général
                    title: "text-lg font-bold text-white", // Style du titre
                    confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
                  }
                 });
                return;
              }
      
              // Vérification des autorisations
              if (product.userId !== user.id && user.role !== "ADMIN") {
                Swal.fire({
                  icon: 'error',
                  title: 'Action non autorisée',
                  text: "Vous n'avez pas la permission de mettre à jour ce produit.",
                  background: "#1e293b", // Fond sombre
                  color: "#f8fafc", // Texte clair
                  iconColor: "#e11d48", // Icône rouge vif
                  confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
                  customClass: {
                    popup: "rounded-lg shadow-lg", // Style général
                    title: "text-lg font-bold text-white", // Style du titre
                    confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
                  }
                });
                return;
              }
      
              await updateProduct(
                String(editingProduct.id),
                { name, quantity: parseInt(quantity), price_v: parseFloat(price_v), imageUrl },
                user.id,
                user.role as "ADMIN" | "USER"
              );
              
              Swal.fire({
                icon: 'success',
                title: 'Infos',
                text: "Produit mis à jour !",
                background: "#1e293b", // Fond sombre
                color: "#f8fafc", // Texte clair
                iconColor: "#e11d48", // Icône rouge vif
                confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
                customClass: {
                  popup: "rounded-lg shadow-lg", // Style général
                  title: "text-lg font-bold text-white", // Style du titre
                  confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
                }
              });
              
            
            } else {
              // ✅ Ajout d'un nouveau produit
              await createProduct({ name, quantity: parseInt(quantity), price_v: parseFloat(price_v), imageUrl }, user.id);
              Swal.fire({
                icon: 'success',
                title: 'Infos',
                text: "Produit ajouté !",
                background: "#1e293b", // Fond sombre
                color: "#f8fafc", // Texte clair
                iconColor: "#e11d48", // Icône rouge vif
                confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
                customClass: {
                  popup: "rounded-lg shadow-lg", // Style général
                  title: "text-lg font-bold text-white", // Style du titre
                  confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
                }
              });
            
            }
      
            loadProducts();
            setEditingProduct(null);
            setName("");
            setQuantity("");
            setPriceV("");
            setImageUrl("");
            Swal.close();
          });
        } catch (error) {
          Swal.close();
          toast.error("Une erreur est survenue !");
        }
      };
      
  
    const handleDeleteProduct = async (productId: string) => {
        // Affichage de la confirmation de suppression
        Swal.fire({
          title: "Supprimer ce produit ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Oui, supprimer",
          cancelButtonText: "Annuler",
          background: "#1e293b", // Fond sombre
          color: "#f8fafc", // Texte clair
          iconColor: "#e11d48", // Icône rouge vif
          confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
          customClass: {
            popup: "rounded-lg shadow-lg", // Style général
            title: "text-lg font-bold text-white", // Style du titre
            confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
          }
        }).then(async (result) => {
          if (!result.isConfirmed) return; // Si l'utilisateur annule, rien ne se passe
      
          if (!user?.id || !user?.role) {
            Swal.fire({
              icon: 'error',
              title: 'Utilisateur non authentifié',
              text: 'Vous devez être connecté pour effectuer cette action.',
              background: "#1e293b", // Fond sombre
              color: "#f8fafc", // Texte clair
              iconColor: "#e11d48", // Icône rouge vif
              confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
              customClass: {
                popup: "rounded-lg shadow-lg", // Style général
                title: "text-lg font-bold text-white", // Style du titre
                confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
              }
            });
            return;
          }
      
          // Trouver le produit à partir de l'ID dans votre liste de produits
          const product = products.find(p => p.id === productId);
      
          if (!product) {
            Swal.fire({
              icon: 'error',
              title: 'Produit introuvable',
              text: 'Le produit que vous tentez de supprimer n\'existe pas.',
              background: "#1e293b", // Fond sombre
              color: "#f8fafc", // Texte clair
              iconColor: "#e11d48", // Icône rouge vif
              confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
              customClass: {
                popup: "rounded-lg shadow-lg", // Style général
                title: "text-lg font-bold text-white", // Style du titre
                confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
              }
            });
            return;
          }
      
          // Vérification des droits d'accès
          if (product.userId !== user.id && user.role !== "ADMIN") {
            Swal.fire({
              icon: 'error',
              title: 'Action non autorisée',
              text: "Vous n'avez pas la permission de supprimer ce produit.",
              background: "#1e293b", // Fond sombre
              color: "#f8fafc", // Texte clair
              iconColor: "#e11d48", // Icône rouge vif
              confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
              customClass: {
                popup: "rounded-lg shadow-lg", // Style général
                title: "text-lg font-bold text-white", // Style du titre
                confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
              }
            });
            return; // Si l'utilisateur n'a pas les droits nécessaires, on arrête l'exécution
          }
      
          try {
            // Suppression du produit
            await deleteProduct(productId, user.id, user.role as "ADMIN" | "USER");
                
            Swal.fire({
                icon: 'success',
                title: 'Infos',
                text: "Produit supprimé !",
                background: "#1e293b", // Fond sombre
                color: "#f8fafc", // Texte clair
                iconColor: "#e11d48", // Icône rouge vif
                confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
                customClass: {
                  popup: "rounded-lg shadow-lg", // Style général
                  title: "text-lg font-bold text-white", // Style du titre
                  confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
                }
              });
              loadProducts();
              
           
            loadProducts();
          } catch (error) {
            // Gestion des erreurs
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression du produit.',
              background: "#1e293b", // Fond sombre
              color: "#f8fafc", // Texte clair
              iconColor: "#e11d48", // Icône rouge vif
              confirmButtonColor: "#2563eb", // Couleur du bouton de confirmation
              customClass: {
                popup: "rounded-lg shadow-lg", // Style général
                title: "text-lg font-bold text-white", // Style du titre
                confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md", // Style du bouton
              }
            });
          }
        });
      };
      
  
    return (
      <div className="max-w-2xl mx-auto p-4 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Gérer les Produits</h1>
        <div className="bg-white shadow-md rounded-lg p-4">
          <Input className="border p-2 w-full mb-2" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
          <Input className="border p-2 w-full mb-2" type="number" placeholder="Quantité" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <Input className="border p-2 w-full mb-2" type="number" placeholder="Prix de vente" value={price_v} onChange={(e) => setPriceV(e.target.value)} />
          
          {/* Affichage de l'image actuelle du produit si elle existe */}
          {imageUrl && <Image
  src={imageUrl || "/placeholder.jpg"}
  alt="Image du produit"
  width={200}
  height={200}
  onError={(e) => (e.currentTarget.src = "/default.jpeg")}
/>
}
  
          <Uploader onUpload={(url) => setImageUrl(url)} />
          <Button className="bg-green-500 text-white p-2 rounded w-full mt-2" onClick={handleAddOrUpdateProduct}>
            {editingProduct ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
  
        <h2 className="text-xl font-bold mt-6 text-black">Liste des Produits</h2>
        <div className="mt-4">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="border p-3 rounded flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                {/* Affichage de l'image du produit */}
                {product.imageUrl && <Image src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover"  width={200} height={200} />}
                <div>
                  <p className="text-black font-bold">{product.name}</p>
                  <p className="text-black">Quantité: {product.quantity}</p>
                  <p className="text-black">Prix: {product.price_v} MRU</p>
                  <p className="text-black">Créé par: {product.user.name}</p>
                  <p className="text-black">NNI: {product.user.nni}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    setEditingProduct(product);
                    setName(product.name);
                    setQuantity(product.quantity.toString());
                    setPriceV(product.price_v.toString());
                    setImageUrl(product.imageUrl || "");
                  }}
                >
                  Modifier
                </Button>
                <Button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteProduct(product.id)}>
                  Supprimer
                </Button>
              </div>
            </div>
          ))}

<div className="flex justify-center items-center gap-4 mt-4">
        <Button
          className="bg-gray-500 text-white px-3 py-1 rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>

        <span className="text-black">
          Page {currentPage} / {totalPages}
        </span>

        <Button
          className="bg-gray-500 text-white px-3 py-1 rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
        </div>
      </div>
    );
  }
  