export default function StatsSection() {
     const stats = [
       { label: "Offres d'emploi", value: "12,500+" },
       { label: "Entreprises partenaires", value: "2,800+" },
       { label: "Candidats placés", value: "45,000+" },
       { label: "Satisfaction", value: "98%" },
     ]
   
     return (
       <section className="bg-white border-b border-border py-12 md:py-16">
         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {stats.map((stat, index) => (
               <div key={index} className="text-center">
                 <h3 className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</h3>
                 <p className="text-sm md:text-base text-muted-foreground">{stat.label}</p>
               </div>
             ))}
           </div>
         </div>
       </section>
     )
   }
   