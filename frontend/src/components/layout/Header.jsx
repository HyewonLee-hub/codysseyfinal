import PageContainer from "./PageContainer.jsx";
import { useAuth } from "../../auth/useAuth.js";
import wordmark from "../../assets/brand/01_chevron_wordmark.svg";

const defaultItems = [
  "무료진단",
  "오늘의 단어",
  "학습",
  "마이페이지",
  "고객센터",
];

export default function Header({
  items = defaultItems,
  active,
  onNavigate,
  action,
  className = "",
  home = false,
}) {
  const { isAuthenticated, clearSession } = useAuth();

  function handleLogout() {
    clearSession();
    if (window.location.pathname !== "/login")
      window.history.pushState(null, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <header
      className={`${home ? "rounded-[38px] border-0 shadow-header" : "border-b border-line"} sticky z-50 bg-white  ${className}`}
    >
      <PageContainer
        className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${home ? "min-h-[70px] !px-5 py-3 sm:!px-7" : "min-h-[84px] py-4"}`}
      >
        <button
          type="button"
          onClick={() => onNavigate?.("홈")}
          aria-label="TYPEUP 홈으로 이동"
          className="shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <img
            src={wordmark}
            width="766"
            height="288"
            alt="TYPEUP"
            className="h-auto w-[88px] sm:w-[104px]"
          />
        </button>
        <nav
          aria-label="주 메뉴"
          className={`order-3 flex w-full flex-wrap justify-center gap-x-5 gap-y-3 sm:order-none sm:w-auto sm:flex-1 sm:gap-x-8 ${home ? "xl:gap-x-12" : "lg:gap-x-12"}`}
        >
          {items.map((item) => (
            <button
              key={item}
              type="button"
              aria-current={active === item ? "page" : undefined}
              onClick={() => onNavigate?.(item)}
              className={`text-[15px] hover:text-primary focus-visible:rounded focus-visible:outline-2 focus-visible:outline-primary ${active === item ? "font-bold text-primary" : "text-nav"}`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div
          className={`ml-auto flex shrink-0 items-center gap-4 ${home ? "xl:pl-[26px]" : ""}`}
        >
          {action}
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded text-[14px] font-bold text-body hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              로그아웃
            </button>
          )}
        </div>
      </PageContainer>
    </header>
  );
}
