import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const UserProfile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await signOut();
  };

  if (!user || !profile) return null;

  const initials = profile.full_name
    ? profile.full_name.split(' ')
        .map(name => name[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 hover:bg-muted/50 transition-all duration-300 p-2 h-auto"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium truncate max-w-32">
              {profile.full_name}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-32">
              {profile.career_field || t('profile.professional')}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="p-3 border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
          </div>
        </div>
        <div className="p-1">
          <Button
            variant="ghost"
            className="w-full justify-start h-8 px-2 text-sm"
            onClick={() => navigate('/dashboard')}
          >
            <User className="h-4 w-4 mr-2" />
            {t('profile.dashboard')}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start h-8 px-2 text-sm"
            onClick={() => navigate('/dashboard')}
          >
            <Settings className="h-4 w-4 mr-2" />
            {t('profile.settings')}
          </Button>
          <div className="my-1 h-px bg-border" />
          <Button
            variant="ghost"
            className="w-full justify-start h-8 px-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('profile.logout')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;