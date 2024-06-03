import "./App.css";
import AllTokenTable from "@/components/AllTokenTable";
import AddNewToken from "./components/AddNewModel";

function App() {
  return (
    <main className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-4 text-center">All Projects</h1>
      <div className="flex justify-end my-4">
        <AddNewToken />
      </div>
      <AllTokenTable />
    </main>
  );
}

export default App;
