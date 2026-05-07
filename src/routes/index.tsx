import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Cloud, Droplets, Mail, MapPin, Sparkles, Thermometer, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const ENDPOINT = "https://weather-ai-project.onrender.com/generate-report";

type ReportData = {
  city?: string;
  temperature?: number | string;
  humidity?: number | string;
  condition?: string;
  report?: string;
  ai_report?: string;
  email_sent?: boolean;
  [k: string]: unknown;
};

function Index() {
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReportData | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Por favor, informe uma cidade.");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: city.trim(), email: email.trim() || undefined }),
      });
      if (!res.ok) {
        let detail: string | undefined;
        try {
          const errorData = await res.json();
          if (typeof errorData?.detail === "string") {
            detail = errorData.detail;
          } else if (Array.isArray(errorData?.detail)) {
            detail = errorData.detail.map((d: { msg?: string }) => d?.msg ?? JSON.stringify(d)).join(", ");
          } else if (errorData?.detail) {
            detail = JSON.stringify(errorData.detail);
          }
        } catch {
          // response was not JSON
        }
        throw new Error(detail ?? `Erro ao gerar relatório (${res.status}).`);
      }
      const json = (await res.json()) as ReportData;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const aiText = data?.ai_report ?? data?.report;
  const emailSent = Boolean(data?.email_sent) || (data && email.trim().length > 0 && !error);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-12 sm:py-20">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
            Smart Weather <span className="gradient-text">AI Report</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
            Receba uma análise climática inteligente de qualquer cidade do mundo,
            gerada por IA em segundos.
          </p>
        </header>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="glass shadow-card rounded-3xl p-6 sm:p-8"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="city" className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" /> Cidade
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo, Tokyo, Lisboa..."
                className="w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Mail className="h-4 w-4 text-primary" /> Email <span className="text-muted-foreground font-normal">(opcional)</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@exemplo.com"
                className="w-full rounded-xl bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:ring-2 focus:ring-ring"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl px-6 py-3.5 font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Gerando relatório...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Gerar relatório
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-6 glass shadow-card animate-pulse rounded-3xl p-8">
            <div className="mb-4 h-6 w-1/3 rounded bg-muted/40" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 rounded-xl bg-muted/30" />
              <div className="h-20 rounded-xl bg-muted/30" />
              <div className="h-20 rounded-xl bg-muted/30" />
            </div>
            <div className="mt-6 space-y-2">
              <div className="h-3 w-full rounded bg-muted/30" />
              <div className="h-3 w-5/6 rounded bg-muted/30" />
              <div className="h-3 w-4/6 rounded bg-muted/30" />
            </div>
          </div>
        )}

        {/* Result Card */}
        {data && !loading && (
          <article className="mt-6 glass shadow-card rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Relatório climático
                </p>
                <h2 className="mt-1 flex items-center gap-2 text-3xl font-bold">
                  <MapPin className="h-6 w-6 text-primary" />
                  {String(data.city ?? city)}
                </h2>
              </div>
              <Cloud className="h-12 w-12 text-primary animate-float" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Stat
                icon={<Thermometer className="h-5 w-5" />}
                label="Temperatura"
                value={data.temperature !== undefined ? `${data.temperature}°` : "—"}
              />
              <Stat
                icon={<Droplets className="h-5 w-5" />}
                label="Umidade"
                value={data.humidity !== undefined ? `${data.humidity}%` : "—"}
              />
              <Stat
                icon={<Cloud className="h-5 w-5" />}
                label="Condição"
                value={data.condition ?? "—"}
              />
            </div>

            {aiText && (
              <div className="mt-6 rounded-2xl border border-border bg-background/30 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="h-4 w-4" />
                  Análise da IA
                </div>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {String(aiText)}
                </p>
              </div>
            )}

            {emailSent && email.trim() && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <p className="text-foreground">
                  Relatório enviado com sucesso para <span className="font-semibold">{email}</span>
                </p>
              </div>
            )}
          </article>
        )}

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Smart Weather AI Report · {new Date().getFullYear()}
        </footer>
      </div>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/30 p-4 transition hover:border-primary/40">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-bold capitalize">{value}</div>
    </div>
  );
}
