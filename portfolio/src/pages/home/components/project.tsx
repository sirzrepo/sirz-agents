import { ArrowUpRight } from "lucide-react"

export default function Projects() {
  const projects = [
    { name: "SIRZ.CO.UK", id: "sirz" },
    { name: "AI AGENTS", id: "ai-agents" },
    { name: "CRM", id: "crm" },
    { name: "DIGITAL MARKETING STACK", id: "digital-marketing" },
    { name: "BRANDCOM.AI", id: "brandcom" },
  ]

  return (
    <div id="works" className="bg-[radial-gradient(circle,_#1b203c_0%,_#141414_90%)] border-b border-slate-700 text-white py-10 md:py-20">
      <div className="sm:w-[80%] w-[90%] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-[1px] h-6 bg-cyan-400"></div>
            <span className="text-gray-300 font-medium text-md">Project Portfolio</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium tracking-wide">MY PORTFOLIO PROJECTS</h1>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className=" border-t border-slate-300/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer group"
            >
              <div className="p-6 md:p-8 relative">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg md:text-xl font-light text-gray-300 tracking-wide">{project.name}</h2>
                  <ArrowUpRight className="w-10 h-10 text-gray-400 group-hover:text-white transition-colors border rounded-full p-2 flex-shrink-0 ml-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
