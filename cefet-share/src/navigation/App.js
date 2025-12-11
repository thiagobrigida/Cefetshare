import { useState, useEffect } from 'react';
import { db, auth, provider } from './firebase';
import { signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoZap, setNovoZap] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((usuario) => {
      setUser(usuario);
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "itens"), orderBy("criadoEm", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(lista);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleAdicionar = async (e) => {
    e.preventDefault();
    if (!novoTitulo || !novoZap) return alert("Preencha tudo!");

    await addDoc(collection(db, "itens"), {
      titulo: novoTitulo,
      whatsapp: novoZap,
      criadoEm: new Date(),
      autor: user.displayName,
      autorId: user.uid
    });

    setNovoTitulo("");
    setNovoZap("");
    alert("Item adicionado!");
  };

  return (
    <div className="container">
      <header>
        <h1>🎓 CefetShare</h1>
        {user ? (
          <button onClick={() => signOut(auth)}>Sair ({user.displayName})</button>
        ) : (
          <button onClick={handleLogin}>Entrar com Google</button>
        )}
      </header>

      {/* Só mostra o formulário se estiver logado */}
      {user && (
        <div className="card form-box">
          <h3>Anunciar Doação/Troca</h3>
          <form onSubmit={handleAdicionar}>
            <input 
              type="text" 
              placeholder="O que queres doar? (Ex: Livro de Física)" 
              value={novoTitulo}
              onChange={(e) => setNovoTitulo(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Teu WhatsApp (apenas números)" 
              value={novoZap}
              onChange={(e) => setNovoZap(e.target.value)}
            />
            <button type="submit">Publicar</button>
          </form>
        </div>
      )}

      {/* Lista de Itens */}
      <div className="feed">
        <h2>Mural de Itens</h2>
        {items.map(item => (
          <div key={item.id} className="card item-card">
            <h3>{item.titulo}</h3>
            <p>Doado por: {item.autor}</p>
            <a 
              href={`https://wa.me/55${item.whatsapp}?text=Oi! Vi teu item no CefetShare.`} 
              target="_blank"
              className="whatsapp-btn" 
            >
              Chamar no WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;