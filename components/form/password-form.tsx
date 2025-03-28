import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PasswordFormProps {
  loading: boolean;
}

interface PasswordFormProps {
  loading: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  values: Record<string, string>;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
}

const PasswordForm = ({
  loading,
  errors,
  touched,
  values,
  handleChange,
  handleBlur,
  handleSubmit
}: PasswordFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        {/* Campos del formulario */}
        <div className="grid gap-2">
          <label htmlFor="currentPassword" className="text-sm font-medium">
            Contraseña Actual
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={values.currentPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={loading}
          />
          {touched.currentPassword && errors.currentPassword ? (
            <p className="text-sm text-red-500">{typeof errors.currentPassword === 'string' ? errors.currentPassword : ''}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="newPassword" className="text-sm font-medium">
            Nueva Contraseña
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={loading}
          />
          {touched.newPassword && errors.newPassword ? (
            <p className="text-sm text-red-500">{typeof errors.newPassword === 'string' ? errors.newPassword : ''}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirmar Nueva Contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={loading}
          />
          {touched.confirmPassword && errors.confirmPassword ? (
            <p className="text-sm text-red-500">{typeof errors.confirmPassword === 'string' ? errors.confirmPassword : ''}</p>
          ) : null}
        </div>

        <Button className='w-fit ml-auto' type="submit" disabled={loading}>
          <Lock className="mr-2 h-4 w-4" />
          {loading ? 'Actualizando...' : 'Actualizar Seguridad'}
        </Button>
      </div>
    </form>
  );
};

export default PasswordForm;