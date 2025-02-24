import { useEffect, useState } from "react";
import axios from "axios";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publication_date: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  // Fetch books from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (Add or Update a book)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        // Update existing book
        const res = await axios.put(
          `http://localhost:5000/books/${editingBook.id}`,
          form
        );
        setBooks(
          books.map((book) => (book.id === editingBook.id ? res.data : book))
        );
        setEditingBook(null);
      } else {
        // Add a new book
        const res = await axios.post("http://localhost:5000/books", form);
        setBooks([...books, res.data]);
      }

      // Reset form
      setForm({
        title: "",
        author: "",
        genre: "",
        publication_date: "",
        description: "",
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to save book. Please try again.");
    }
  };

  // Handle book delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Error deleting book", err);
    }
  };

  // Handle edit click
  const handleEditClick = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publication_date: book.publication_date
        ? book.publication_date.split("T")[0]
        : "",
      description: book.description,
    });
  };

  // Determine if scrollbar should be visible based on number of books
  const showScrollbar = books.length > 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-800 inline-flex items-center gap-3">
            <span className="text-3xl">📚</span> Ramzi Collection
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your personal book catalog with ease
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add / Edit Book Panel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
            <div className="bg-indigo-700 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span>{editingBook ? "✏️ Edit Book" : "➕ Add New Book"}</span>
              </h2>
            </div>
            <div className="p-6">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 border border-red-100">
                  <p className="flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Book Title"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={form.author}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="genre"
                  placeholder="Genre"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={form.genre}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="publication_date"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  value={form.publication_date}
                  onChange={handleChange}
                />
                <textarea
                  name="description"
                  placeholder="Brief description"
                  className="w-full p-3 border border-gray-300 rounded-lg h-24"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition"
                >
                  {editingBook ? "🔄 Update Book" : "📝 Add to Collection"}
                </button>

                {/* Cancel Edit Button */}
                {editingBook && (
                  <button
                    type="button"
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg mt-2"
                    onClick={() => {
                      setEditingBook(null);
                      setForm({
                        title: "",
                        author: "",
                        genre: "",
                        publication_date: "",
                        description: "",
                      });
                    }}
                  >
                    ❌ Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Book Collection Panel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 lg:col-span-2 flex flex-col">
            <div className="bg-indigo-700 p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span>📖</span> Book Collection
              </h2>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
                {books.length} {books.length === 1 ? "book" : "books"}
              </span>
            </div>

            {/* Scrollable book list container */}
            <div
              className={`p-6 ${showScrollbar ? "overflow-y-auto" : ""}`}
              style={showScrollbar ? { maxHeight: "500px" } : {}}
            >
              {books.length === 0 ? (
                <p className="text-gray-500 text-center">
                  Your collection is empty
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-4">
                  {books.map((book) => (
                    <li
                      key={book.id}
                      className="border p-5 rounded-lg flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-bold text-lg text-indigo-800">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 mt-1">By {book.author}</p>

                        {book.genre && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                            {book.genre}
                          </span>
                        )}

                        {book.publication_date && (
                          <p className="text-gray-500 text-sm mt-1">
                            📅 Published:{" "}
                            {new Date(
                              book.publication_date
                            ).toLocaleDateString()}
                          </p>
                        )}

                        {book.description && (
                          <p className="text-gray-700 mt-2 text-sm">
                            📝 {book.description}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="bg-yellow-100 hover:bg-yellow-500 text-yellow-500 hover:text-white px-3 py-2 rounded-lg"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDelete(book.id)}
                          className="bg-red-100 hover:bg-red-500 text-red-500 hover:text-white px-3 py-2 rounded-lg"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Scroll indicator that appears only when scrolling is active */}
            {showScrollbar && (
              <div className="bg-indigo-50 p-2 text-center text-xs text-indigo-500 border-t border-indigo-100">
                Scroll to see more books
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
