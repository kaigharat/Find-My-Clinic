import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Github } from "lucide-react";
import type { TeamMember } from "@/lib/types";

interface TeamMemberProps {
  member: TeamMember;
  index: number;
}

export default function TeamMemberCard({ member, index }: TeamMemberProps) {
  const linkedinUrl = member.name === "Yashodhan Rajapkar" ? "https://www.linkedin.com/in/yashodhan-rajapkar-807014284" :
                     member.name === "Kaivalya Gharat" ? "https://www.linkedin.com/in/kaivalya-gharat-296704202/" :
                     member.name === "Swarali Mahishi" ? "https://www.linkedin.com/in/swarali-a-mahishi-2759262a9/" : null;

  return (
    <Card className="text-center hover:shadow-lg transition-shadow animate-fade-in" data-testid={`team-member-${index}`}>
      <CardContent className="p-6">
        <img
          src={member.image}
          alt={`Professional headshot of ${member.name}`}
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          data-testid={`team-member-image-${index}`}
        />
        <h5 className="font-semibold text-gray-900 mb-1" data-testid={`team-member-name-${index}`}>
          {member.name}
        </h5>
        <p className="text-sm text-gray-600 mb-2" data-testid={`team-member-role-${index}`}>
          {member.role}
        </p>
        <p className="text-xs text-gray-500 mb-3" data-testid={`team-member-bio-${index}`}>
          {member.bio}
        </p>
        <div className="flex gap-2 justify-center">
          {linkedinUrl && (
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
              onClick={() => window.open(linkedinUrl, '_blank')}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          )}
          {(member.name === "Yashodhan Rajapkar" || member.name === "Kaivalya Gharat" || member.name === "Swarali Mahishi") && (
            <Button
              variant="outline"
              size="sm"
              className="text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              onClick={() => {
                const githubUrls = {
                  "Yashodhan Rajapkar": "https://github.com/yash9769",
                  "Kaivalya Gharat": "https://github.com/kaigharat",
                  "Swarali Mahishi": "https://github.com/swara2402"
                };
                window.open(githubUrls[member.name as keyof typeof githubUrls], '_blank');
              }}
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
