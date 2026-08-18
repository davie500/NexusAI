import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProfileCompletion = () => {
  const { profile } = useAuth();
  const { t } = useLanguage();

  if (!profile) return null;

  const fields = [
    { name: t('settings.fullName'), value: profile.full_name, required: true },
    { name: t('settings.email'), value: profile.email, required: true },
    { name: t('settings.careerField'), value: profile.career_field, required: false },
    { name: t('settings.experienceLevel'), value: profile.experience_level, required: false },
    { name: t('settings.bio'), value: profile.bio, required: false },
    { name: t('settings.avatarUrl'), value: profile.avatar_url, required: false },
  ];

  const filledFields = fields.filter(field => field.value && field.value.trim() !== '');
  const completionPercentage = (filledFields.length / fields.length) * 100;

  const missingOptionalFields = fields.filter(
    field => !field.required && (!field.value || field.value.trim() === '')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          {t('settings.profileCompletion')}
        </CardTitle>
        <CardDescription>
          {t('settings.completeYourProfile')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {Math.round(completionPercentage)}% {t('settings.complete')}
            </span>
            <span className="text-sm text-muted-foreground">
              {filledFields.length} / {fields.length} {t('settings.fields')}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {field.value && field.value.trim() !== '' ? (
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={field.value && field.value.trim() !== '' ? 'text-foreground' : 'text-muted-foreground'}>
                {field.name}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </span>
            </div>
          ))}
        </div>

        {missingOptionalFields.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">{t('settings.suggestions')}:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {missingOptionalFields.map((field, index) => (
                <li key={index}>• {t('settings.add')} {field.name.toLowerCase()}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileCompletion;
