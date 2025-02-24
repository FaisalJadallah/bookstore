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
  const [isFormVisible, setIsFormVisible] = useState(false);

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
      setIsFormVisible(false);
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
    setIsFormVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-600">
              BookShelf
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your digital library for storing and managing your favorite books
          </p>
        </header>

        {/* Main Content */}
        <div className="mb-12 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span>Your Collection</span>
            <span className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full">
              {books.length} {books.length === 1 ? "book" : "books"}
            </span>
          </div>
          <button
            onClick={() => {
              setEditingBook(null);
              setForm({
                title: "",
                author: "",
                genre: "",
                publication_date: "",
                description: "",
              });
              setIsFormVisible(!isFormVisible);
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2"
          >
            {isFormVisible && !editingBook ? "Cancel" : "Add New Book"}
          </button>
        </div>

        {/* Form Section - Conditionally shown */}
        {isFormVisible && (
          <div className="mb-12 bg-white rounded-2xl shadow-xl p-8 border-t-4 border-teal-500 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingBook ? "Edit Book Details" : "Add New Book"}
            </h2>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="The Great Gatsby"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    placeholder="F. Scott Fitzgerald"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={form.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    name="genre"
                    placeholder="Fiction, Classic"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={form.genre}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    name="publication_date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    value={form.publication_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="A brief summary of the book..."
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={form.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-medium transition shadow-md"
                >
                  {editingBook ? "Update Book" : "Save Book"}
                </button>

                {editingBook && (
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition"
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
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Books Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-md p-12 text-center">
              <img
                src="/api/placeholder/120/120"
                alt="Empty bookshelf"
                className="mx-auto mb-6"
              />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Your collection is empty
              </h3>
              <p className="text-gray-500">
                Add your first book to start building your collection
              </p>
            </div>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-xl border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl text-gray-800 mb-1">
                      {book.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(book)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">By {book.author}</p>

                  {book.description && (
                    <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                      {book.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {book.genre && (
                      <span className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full">
                        {book.genre}
                      </span>
                    )}

                    {book.publication_date && (
                      <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                        {new Date(book.publication_date).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}