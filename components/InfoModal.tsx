import React, { useState } from "react";
import {
  CloseIcon,
  CheckCircleIcon,
  ProhibitIcon,
  GetStartedIcon,
  ShieldCheckIcon,
  HeartIcon,
  GitHubIcon,
} from "./Icons";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "get-started" | "rules" | "about";

// Tab Button Component
const TabButton: React.FC<{
  label: string;
  tabId: Tab;
  activeTab: Tab;
  onSelect: (tabId: Tab) => void;
  children: React.ReactNode;
}> = ({ label, tabId, activeTab, onSelect, children }) => {
  const isActive = activeTab === tabId;
  return (
    <button
      onClick={() => onSelect(tabId)}
      className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-t-lg md:rounded-lg md:rounded-r-none transition-all duration-200 border-b-4 md:border-b-0 md:border-l-4 ${
        isActive
          ? "bg-gray-700/50 border-teal-500 text-white"
          : "bg-transparent border-transparent text-gray-400 hover:bg-gray-700/30 hover:text-white"
      }`}
      role="tab"
      aria-selected={isActive}
    >
      {children}
      <span className="hidden md:inline font-semibold">{label}</span>
    </button>
  );
};

// Rule Component
const Rule: React.FC<{ allowed: boolean; children: React.ReactNode }> = ({
  allowed,
  children,
}) => (
  <div
    className={`flex items-start gap-4 bg-gray-900/50 p-4 rounded-lg border-l-4 ${
      allowed ? "border-green-500" : "border-red-500"
    }`}
  >
    {allowed ? (
      <CheckCircleIcon className="w-7 h-7 text-green-500 flex-shrink-0 mt-0.5" />
    ) : (
      <ProhibitIcon className="w-7 h-7 text-red-500 flex-shrink-0 mt-0.5" />
    )}
    <p className="text-gray-300 text-sm md:text-base">{children}</p>
  </div>
);

// Main Modal Component
export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>("get-started");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] text-white flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar / Tabs */}
        <div className="bg-gray-900/50 p-2 md:p-4 flex flex-row md:flex-col justify-around md:justify-start md:gap-2 border-b md:border-b-0 md:border-r border-gray-700/50">
          <TabButton
            label="Get Started"
            tabId="get-started"
            activeTab={activeTab}
            onSelect={setActiveTab}
          >
            <GetStartedIcon className="w-6 h-6" />
          </TabButton>
          <TabButton
            label="Community Rules"
            tabId="rules"
            activeTab={activeTab}
            onSelect={setActiveTab}
          >
            <ShieldCheckIcon className="w-6 h-6" />
          </TabButton>
          <TabButton
            label="About"
            tabId="about"
            activeTab={activeTab}
            onSelect={setActiveTab}
          >
            <HeartIcon className="w-6 h-6" />
          </TabButton>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
          >
            <CloseIcon className="w-7 h-7" />
          </button>

          {activeTab === "get-started" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-white">
                Welcome to Pixel World Painter!
              </h2>
              <p className="text-gray-400 text-lg">
                Leave your mark on a massive, collaborative canvas built on the
                world map. Team up with others to create art, protect your
                territory, or just have fun placing pixels.
              </p>

              <div className="bg-gray-900/50 p-5 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Keyboard Shortcuts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-200">
                      Paint Continuously
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Hold{" "}
                      <kbd className="mx-1 px-1.5 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">
                        SPACE
                      </kbd>
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200">Toggle Grid</h4>
                    <p className="text-gray-300 text-sm">
                      Press{" "}
                      <kbd className="mx-1 px-1.5 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">
                        G
                      </kbd>
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-200">Tools</h4>
                    <p className="text-gray-300 text-sm flex items-center gap-x-4 gap-y-2 flex-wrap">
                      <span>
                        <kbd className="mr-2 px-1.5 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">
                          1
                        </kbd>{" "}
                        Paint
                      </span>
                      <span>
                        <kbd className="mr-2 px-1.5 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">
                          2
                        </kbd>{" "}
                        Eraser
                      </span>
                      <span>
                        <kbd className="mr-2 px-1.5 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">
                          3
                        </kbd>{" "}
                        Picker
                      </span>
                      <span>
                        <kbd className="mr-2 px-1.5 py-1 text-xs font-semibold text-gray-200 bg-gray-700 border border-gray-600 rounded-md">
                          4
                        </kbd>{" "}
                        Custom Color
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                Zoom in to see the pixel grid and start painting. Click on any
                pixel when zoomed out to see its coordinates and status.
              </p>
            </div>
          )}

          {activeTab === "rules" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-white">
                Community Guidelines
              </h2>
              <p className="text-gray-400">
                Help us maintain a creative, safe, and fair environment for all
                artists.
              </p>
              <div className="space-y-4">
                <Rule allowed={false}>
                  Respect creative works. Do not engage in vandalism or
                  intentionally deface the art of other users.
                </Rule>
                <Rule allowed={false}>
                  Keep it civil. Harassment, hate speech, and posting explicit
                  or offensive content are strictly prohibited.
                </Rule>
                <Rule allowed={false}>
                  One artist, one account. Using multiple accounts to gain an
                  unfair advantage is not permitted.
                </Rule>
                <Rule allowed={false}>
                  All pixels must be placed manually. The use of bots, scripts,
                  or any form of automation is forbidden.
                </Rule>
                <Rule allowed={false}>
                  Protect user privacy. Sharing the personal information of
                  others (doxxing) will not be tolerated.
                </Rule>
                <Rule allowed={true}>
                  Collaboration is encouraged. Building upon, modifying, or
                  evolving another's artwork is welcome.
                </Rule>
              </div>
              <p className="text-sm text-gray-500 pt-4 border-t border-gray-700/50">
                Failure to follow these guidelines may result in a temporary or
                permanent suspension of your account.
              </p>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-white">About & Credits</h2>
              <p className="text-gray-400">
                This project is a collaborative pixel art experiment built with
                modern web technologies.
              </p>

              <div className="bg-gray-900/50 p-5 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Open Source
                </h3>
                <p className="text-sm text-gray-300 mb-2">
                  This project is open-source. Contributions are welcome!
                </p>
                <a
                  href="https://github.com/nakumi/pixel-world-painter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-teal-400 hover:underline"
                >
                  <GitHubIcon className="w-5 h-5" />
                  <span>View on GitHub</span>
                </a>
              </div>

              <div className="bg-gray-900/50 p-5 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Attribution
                </h3>
                <p className="text-sm text-gray-300">
                  Map powered by{" "}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline"
                  >
                    OpenStreetMap
                  </a>{" "}
                  contributors &amp;{" "}
                  <a
                    href="https://carto.com/attributions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline"
                  >
                    CARTO
                  </a>
                  .
                </p>
              </div>

              <div className="bg-gray-900/50 p-5 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Contact
                </h3>
                <p className="text-sm text-gray-300">
                  For questions or support, please email{" "}
                  <a
                    href="mailto:nakumi@nakumi.my.id"
                    className="text-teal-400 hover:underline"
                  >
                    nakumi@nakumi.my.id
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
        <style>{`.animate-fade-in { animation: fadeIn 0.3s ease-in-out; } @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  );
};
