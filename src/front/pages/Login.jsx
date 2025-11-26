
// Guarda email y password en el estado local y simula login en la consola.
// Muestra el aviso de "Cuenta creada" si viene el query param registered=1.
// Usa AuthShell y TextInput como componentes hijos.

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import TextInput from "../components/TextInput";
import { login } from "../jsApiComponents/auth"
import { toast } from "react-toastify";


export function Login() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (sp.get("registered")) setOk("Cuenta creada. Ya puedes iniciar sesión.");
  }, [sp]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) {
      setErr("Completa el email y la contraseña.");
      return;
    }
    console.log("Login (solo UI):", form);
    const data = await login(form)
    if (data.status == 400) {
      setErr("Usuario o contraseña incorrecta.")
      console.log("Respuesta del server", data)

    }
    if (data.status === 200) {
      toast.success("🎉 Sesion iniciada correctamente.");
      nav("/home");
    }

  };

  return (
    <AuthShell title="Iniciar sesión" subtitle="Por favor, inicia sesión para continuar">
      {ok && <div className="alert alert-success py-2">{ok}</div>}
      <form onSubmit={submit} noValidate>
        <TextInput
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="email@example.com"
        />
        <TextInput
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="********"
          withToggle
        />
        <div className="d-flex justify-content-end mb-3">
          <Link to="/forgot" className="link-accent">
            ¿Has olvidado la contraseña?
          </Link>
        </div>
        {err && <div className="alert alert-danger py-2">{err}</div>}
        <button className="btn btn-accent w-100">Entrar</button>
      </form>
      <div className="text-center mt-3">
        <span className="link-muted">¿No tienes cuenta? </span>
        <Link to="/register" className="link-accent">
          Regístrate
        </Link>
      </div>
    </AuthShell>
  );
}
