'use client';

import { useTranslation } from 'react-i18next';
import Container from '@/components/ui/Container';
import { TeamMember } from '@/types';
import '@/lib/i18n';

const fallbackTeamMembers: TeamMember[] = [
  { _id: '1', name: 'Charles Mwiti', role: 'CEO', image: { url: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0030_nc0mt7.jpg', alt: 'Charles Mwiti' } },
  { _id: '2', name: 'Lucy Kathurima', role: 'Director', image: { url: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0029_rmfaxp.jpg', alt: 'Lucy Kathurima' } },
  { _id: '3', name: 'Jadiel Mwongera', role: 'Operations', image: { url: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813226/IMG-20251214-WA0032_ezxukj.jpg', alt: 'Jadiel Mwongera' } },
  { _id: '4', name: 'Anne Karegi', role: 'Accounts', image: { url: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813226/IMG-20251214-WA0031_bazmkr.jpg', alt: 'Anne Karegi' } },
  { _id: '5', name: 'Ray Muriiki', role: 'Finance Analyst', image: { url: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0028_ija8zw.jpg', alt: 'Ray Muriiki' } },
  { _id: '6', name: 'David Njabia', role: 'Tour Consultant', image: { url: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0027_zjsjki.jpg', alt: 'David Njabia' } },
  { _id: '7', name: 'Jacinter Njoroge', role: 'Tour Consultant', image: { url: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0026_ay6xve.jpg', alt: 'Jacinter Njoroge' } },
];

interface TeamSectionProps {
  initialMembers?: TeamMember[];
}

const TeamSection = ({ initialMembers }: TeamSectionProps) => {
  const { t } = useTranslation(['common', 'home']);
  const teamMembers =
    initialMembers && initialMembers.length > 0 ? initialMembers : fallbackTeamMembers;

  return (
    <Container>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">
          {t('home:team.title', 'Our Leadership Team')}
        </h2>
        <p className="text-gray-100 max-w-2xl mx-auto">
          {t(
            'home:team.description',
            'Dedicated safari experts ensuring seamless travel and bespoke adventures across East Africa.'
          )}
        </p>
      </div>

      {/* Mobile Horizontal Scroll View */}
      <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 no-scrollbar">
        {teamMembers.map((member, index) => (
          <div
            key={member._id || index}
            className="snap-center shrink-0 w-[80%] sm:w-[45%] group text-center"
          >
            <div className="relative mb-4 overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src={
                  member.image?.url ||
                  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                }
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-gray-200 font-medium">{member.role}</p>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-wrap gap-8 justify-center">
        {teamMembers.map((member, index) => (
          <div
            key={member._id || index}
            className="group text-center flex-grow basis-full md:basis-[calc(45%-2rem)] lg:basis-[calc(22%-2rem)]"
          >
            <div className="relative mb-4 overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src={
                  member.image?.url ||
                  'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                }
                alt={member.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <p className="text-gray-200 font-medium">{member.role}</p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TeamSection;
