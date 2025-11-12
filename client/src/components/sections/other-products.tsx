export default function OtherProducts() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-3xl font-bold mb-8">🧩 Try Our Other AI Tools</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
        <a
          href="https://magenta-torrone-2bbb56.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          <h3 className="text-xl font-semibold mb-2">🧠 Alzheimer’s Detection</h3>
          <p className="text-gray-600">
            AI-powered early detection tool for Alzheimer's disease.
          </p>
        </a>

        <a
          href="https://diabeties-vit.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition transform hover:scale-105"
        >
          <h3 className="text-xl font-semibold mb-2">💉 Diabetes Detection</h3>
          <p className="text-gray-600">
            Predict diabetes risk from health and lifestyle data
          </p>
        </a>
      </div>
    </section>
  );
}
