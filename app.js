(() => {
  "use strict";
  const cfg = window.ATDJ_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const loginView = $("loginView");
  const dashboardView = $("dashboardView");
  let client = null;

  function setMessage(id, message, kind = "") {
    const el = $(id);
    el.textContent = message || "";
    el.className = "message" + (kind ? " " + kind : "");
  }

  function showLogin() {
    loginView.classList.remove("hidden");
    dashboardView.classList.add("hidden");
  }

  function showDashboard(user, profile) {
    loginView.classList.add("hidden");
    dashboardView.classList.remove("hidden");
    $("userEmail").textContent = user.email || "";
    $("accessEmail").textContent = user.email || "";
    $("accessName").textContent = profile?.display_name || "Compte autorisé";
  }

  async function checkAllowlist(user) {
    const { data, error } = await client
      .from("dashboard_allowed_users")
      .select("email,display_name,is_active")
      .eq("email", String(user.email || "").trim().toLowerCase())
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error("Impossible de vérifier les autorisations. Réessaie plus tard.");
    return data;
  }

  async function loadStats() {
    $("sourceStatus").textContent = "Connexion…";
    $("sourceStatus").className = "status-pill";
    $("sourceDescription").textContent = "Récupération sécurisée des indicateurs du site principal…";
    const { data, error } = await client.functions.invoke("dashboard-stats", { body: {} });
    if (error) {
      let detail = "Le connecteur n’a pas répondu correctement.";
      try {
        const response = error.context;
        if (response && typeof response.json === "function") {
          const payload = await response.json();
          if (payload?.message) detail = payload.message;
        } else if (error.message) {
          detail = error.message;
        }
      } catch (_) {
        if (error.message) detail = error.message;
      }
      $("sourceStatus").textContent = "Erreur de connexion";
      $("sourceStatus").className = "status-pill";
      $("sourceDescription").textContent = detail;
      setMessage("dashboardMessage", "Les accès au tableau de bord sont validés, mais les statistiques ne sont pas encore disponibles.");
      return;
    }
    if (!data?.ok) {
      $("sourceStatus").textContent = "Indisponible";
      $("sourceDescription").textContent = data?.message || "Le connecteur n’a pas renvoyé de statistiques.";
      return;
    }
    $("membersCount").textContent = Number(data.members ?? 0).toLocaleString("fr-FR");
    $("sessionsCount").textContent = Number(data.sessions ?? 0).toLocaleString("fr-FR");
    $("registrationsCount").textContent = Number(data.registrations ?? 0).toLocaleString("fr-FR");
    $("sourceStatus").textContent = "Connecté";
    $("sourceStatus").className = "status-pill ready";
    $("sourceDescription").textContent = "Les indicateurs ont été récupérés depuis la base de données du site principal.";
    $("lastUpdated").textContent = "Mis à jour à " + new Date().toLocaleTimeString("fr-FR", {hour:"2-digit",minute:"2-digit"});
    setMessage("dashboardMessage", "Statistiques actualisées.", "success");
  }

  async function enterApp(user) {
    const access = await checkAllowlist(user);
    if (!access) {
      await client.auth.signOut();
      throw new Error("Cette adresse e-mail ne figure pas dans la liste des personnes autorisées.");
    }
    showDashboard(user, access);
    await loadStats();
  }

  async function init() {
    if (!cfg.supabaseUrl || !cfg.publishableKey || !window.supabase?.createClient) {
      setMessage("loginMessage", "La configuration Supabase de config.js est incomplète.");
      return;
    }
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    $("togglePassword").addEventListener("click", () => {
      const input = $("password");
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      $("togglePassword").textContent = visible ? "Masquer" : "Voir";
      $("togglePassword").setAttribute("aria-label", visible ? "Masquer le mot de passe" : "Afficher le mot de passe");
    });

    $("loginForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $("loginButton");
      button.disabled = true;
      button.textContent = "Connexion…";
      setMessage("loginMessage", "");
      const email = $("email").value.trim().toLowerCase();
      const password = $("password").value;
      try {
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw new Error("Adresse e-mail ou mot de passe incorrect.");
        await enterApp(data.user);
      } catch (err) {
        setMessage("loginMessage", err.message || "Connexion impossible.");
      } finally {
        button.disabled = false;
        button.innerHTML = "Accéder au tableau de bord <span>→</span>";
      }
    });

    $("logoutButton").addEventListener("click", async () => {
      await client.auth.signOut();
      showLogin();
      setMessage("loginMessage", "Tu es déconnecté.", "success");
    });

    const { data } = await client.auth.getSession();
    if (data.session?.user) {
      try { await enterApp(data.session.user); }
      catch { await client.auth.signOut(); showLogin(); }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();