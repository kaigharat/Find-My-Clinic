import TeamMember from "@/components/ui/team-member";
import type { TeamMember as TeamMemberType } from "@/lib/types";
import yashodhanPhoto from "@/images/yash.jpeg";
import kaiPhoto from "@/images/Kai.jpeg";
import swaraPhoto from "@/images/swara.jpeg";

export default function Team() {
  const teamMembers: TeamMemberType[] = [
    {
      name: "Yashodhan Rajapkar",
      role: "Founder & Lead Developer",
      image: yashodhanPhoto,
      bio: "Innovative founder and lead developer with a passion for creating impactful technology solutions.",
    },
    {
      name: "Kaivalya Gharat",
      role: "Co-Founder & Developer",
      image: kaiPhoto,
      bio: "Creative co-founder and developer dedicated to building user-friendly applications that solve real-world problems.",
    },
    {
      name: "Swarali Mahishi",
      role: "Co-Founder & Developer",
      image: swaraPhoto,
      bio: "Dedicated co-founder and developer focused on developing accessible and inclusive technology for everyone.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-primary/5 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-responsive-lg font-bold text-gray-900 mb-6">Meet Our Team</h3>
            <p className="text-responsive text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Passionate healthcare technology innovators working to create a more efficient,
              accessible, and organized local healthcare network for the entire community.
            </p>
          </div>

          <div className="flex justify-center mb-16 animate-slide-up">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
