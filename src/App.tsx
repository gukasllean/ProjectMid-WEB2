import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
  } from "react-router-dom";
  import RootLayout from "./layouts/RootLayout";
  import Carts from "./pages/Todos";
  import Post from "./pages/Post";
  import Product from "./pages/Product";
  import Recipes from "./pages/Recipes";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import Home from "./pages/Home";
  import ProductDetail from "./pages/ProductDetail";
import Todos from "./pages/Todos";
import Comments from "./pages/Comments";
  
  const queryClient = new QueryClient();
  
  function App() {
	const router = createBrowserRouter(
	  createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
		  <Route index element={<Home/>}/>
		  <Route path="product" element={<Product />} />
		  <Route path="product/:id" element={<ProductDetail />} />
		  <Route path="recipes" element={<Recipes />} />
		  <Route path="posts" element={<Post />} />
		  <Route path="todos" element={<Todos />} />
		  <Route path="comments" element={<Comments />} />

		</Route>
	  )
	);
	return (
	  <>
		<QueryClientProvider client={queryClient}>
		  <RouterProvider router={router} />
		</QueryClientProvider>
	  </>
	);
  }
  
  export default App;
  