import { AlertMessages } from "@/components/alert/AlertMessages";
import PasswordForm from "@/components/form/password-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordUpdate } from "@/hooks/auth/usePasswordUpdate";

const CuentaTab = () => {
  const { formik, loading, error, success } = usePasswordUpdate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguridad de la Cuenta</CardTitle>
        <CardDescription>Actualiza tu contraseña y configuración de seguridad</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AlertMessages error={error} success={success} />
        <PasswordForm
          loading={loading}
          errors={formik.errors}
          touched={formik.touched}
          values={formik.values}
          handleChange={formik.handleChange}
          handleBlur={formik.handleBlur}
          handleSubmit={formik.handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default CuentaTab;