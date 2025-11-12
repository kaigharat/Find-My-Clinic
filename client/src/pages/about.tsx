import { Goal, Eye, Heart, Users, Award, Lightbulb, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TeamMember from "@/components/ui/team-member";
import type { TeamMember as TeamMemberType } from "@/lib/types";
import { useTranslation } from "react-i18next";
import yashodhanPhoto from "@/images/yash.jpeg";
import kaiPhoto from "@/images/Kai.jpeg";
import swaraPhoto from "@/images/swara.jpeg";
import abo from "@/images/abo.jpg";

export default function About() {
  const { t } = useTranslation();

  const teamMembers: TeamMemberType[] = [
    {
      name: t('team.yashodhan.name'),
      role: t('team.yashodhan.role'),
      image: yashodhanPhoto,
      bio: t('team.yashodhan.bio')
    },
    {
      name: t('team.kaivalya.name'),
      role: t('team.kaivalya.role'),
      image: kaiPhoto,
      bio: t('team.kaivalya.bio')
    },
    {
      name: t('team.swarali.name'),
      role: t('team.swarali.role'),
      image: swaraPhoto,
      bio: t('team.swarali.bio')
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${abo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${abo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'blur(2px)',
          zIndex: -1
        }}
      ></div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('team.title')}</h2>
              <p className="text-xl text-gray-600">
                {t('team.subtitle')}
              </p>
            </div>

            <div className="flex justify-center">
              {teamMembers.map((member, index) => (
                <div key={index} className="relative">
                  <TeamMember
                    member={member}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="bg-primary/5 border-primary/20 bg-gray-50" data-testid="mission-card ">
                <CardContent className="p-8 ">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                    <Goal className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.mission.title')}</h3>
                  <p className="text-gray-600">
                    {t('about.mission.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-secondary/5 border-secondary/20 bg-gray-50" data-testid="vision-card">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-6">
                    <Eye className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{t('about.vision.title')}</h3>
                  <p className="text-gray-600">
                    {t('about.vision.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.values.title')}</h2>
              <p className="text-xl text-gray-600">
                {t('about.values.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow" data-testid="value-accessibility">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="text-white h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{t('about.values.accessibility.title')}</h4>
                  <p className="text-gray-600">
                    {t('about.values.accessibility.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow" data-testid="value-empathy">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-success rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="text-white h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{t('about.values.empathy.title')}</h4>
                  <p className="text-gray-600">
                    {t('about.values.empathy.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow" data-testid="value-innovation">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-success to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Goal className="text-white h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{t('about.values.innovation.title')}</h4>
                  <p className="text-gray-600">
                    {t('about.values.innovation.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('about.story.title')}</h2>
            </div>

            <Card className="p-8 md:p-12 shadow-lg">
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-gray-600 mb-6">
                  {t('about.story.paragraph1')}
                </p>

                <p className="text-gray-600 mb-6">
                  {t('about.story.paragraph2')}
                </p>

                <p className="text-gray-600">
                  {t('about.story.paragraph3')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
