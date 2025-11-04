export default function PartnerCompanies({ companies = [
    { name: "TechFlow", initials: "TF", color: "bg-blue-500" },
    { name: "StartupX", initials: "SX", color: "bg-purple-500" },
    { name: "DataCore", initials: "DC", color: "bg-green-500" },
    { name: "CloudSync", initials: "CS", color: "bg-orange-500" },
    { name: "WebMaster", initials: "WM", color: "bg-pink-500" },
    { name: "InnovateLabs", initials: "IL", color: "bg-indigo-500" },
  ] }) {

  return (
    <section id="companies" className="bg-white border-b border-border py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Nos entreprises partenaires</h2>
          <p className="text-muted-foreground">Travaillez avec les meilleures entreprises du secteur</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {companies.map((company, index) => (
            <div
              key={index}
              className="bg-secondary rounded-lg p-6 flex items-center justify-center hover:shadow-md transition cursor-pointer"
            >
              <div
                className={`${company.color} w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg`}
              >
                {company.initials}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-opacity-90 transition">
            Devenir partenaire
          </button>
        </div>
      </div>
    </section>
  )
}


