"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import logo from "@/public/pg-horizontal.png";
import Image from "next/image";

export const VeriPropertyLogo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <div className="text-xl font-bold text-gray-900">
      <Image src={logo} alt="veri-property" className="w-30 h-20" />
    </div>
  </Link>
);

const buyMenuItems = [
  {
    title: "HDB Directory",
    items: ["5 Room Flats", "4 Room Flats", "3 Room Flats"],
  },
  {
    title: "Condo Directory",
    items: ["Executive Condos", "3 Bedroom Condos", "2 Bedroom Condos"],
  },
  {
    title: "Landed",
    items: ["Good Class Bungalows", "Bungalows", "Terraced Houses"],
  },
  {
    title: "Buying Resources",
    items: ["Find an Agent"],
  },
];

const rentMenuItems = [
  {
    title: "HDB Directory",
    items: ["3 Room Flats", "2 Room Flats", "HDB Room Rentals"],
  },
  {
    title: "Condo Directory",
    items: ["2 Bedroom Condos", "1 Bedroom Condos", "Condo Room Rentals"],
  },
  {
    title: "Landed",
    items: ["Bungalows", "Terraced Houses", "Landed House Room Rentals"],
  },
  {
    title: "Rental Resources",
    items: ["Find an Agent"],
  },
];

const shortletMenuItems = [
  {
    title: "Shortlet",
    items: ["Shortlet Apartments", "Holiday Homes"],
  },
];



interface MegaMenuProps {
  items: Array<{
    title: string;
    items: string[];
  }>;
  isOpen: boolean;
  onClose: () => void;
  position: "left" | "right";
  triggerRef: React.RefObject<HTMLDivElement | null>;
}

const MegaMenu = ({
  items,
  isOpen,
  onClose,
  position,
}: MegaMenuProps) => {
  if (!isOpen) return null;

  const positionClasses =
    position === "right"
      ? "absolute top-full right-0"
      : "absolute top-full left-[-200px]";

  const getParentRoute = () => {
    if (items === buyMenuItems) return "/buy";
    if (items === rentMenuItems) return "/rent";
    if (items === shortletMenuItems) return "/shortlet";
    return "#";
  };

  const parentRoute = getParentRoute();

  return (
    <div
      className={`${positionClasses} bg-white border-t-2 border-t-gray-100 shadow-lg z-50 min-w-max`}
    >
      <div className="px-6 py-6">
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${Math.min(
              items.length,
              4
            )}, minmax(200px, 1fr))`,
          }}
        >
          {items.map((section, index) => (
            <div key={index} className="min-w-0">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center whitespace-nowrap">
                {section.title}
                <ChevronRight className="w-4 h-4 ml-1 flex-shrink-0" />
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={parentRoute}
                      className="text-gray-600 hover:text-green-600 transition-colors whitespace-nowrap block"
                      onClick={onClose}
                    >
                      {item}
                      {item === "Sell Your Property" && (
                        <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                          New
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface MobileMenuSectionProps {
  title: string;
  items: Array<{
    title: string;
    items: string[];
  }>;
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuSection = ({
  title,
  items,
  isOpen,
  onToggle,
}: MobileMenuSectionProps) => {
  const getParentRoute = () => {
    if (items === buyMenuItems) return "/buy";
    if (items === rentMenuItems) return "/rent";
    if (items === shortletMenuItems) return "/shortlet";
    return "#";
  };

  const parentRoute = getParentRoute();

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between text-left font-medium text-gray-900"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {items.map((section, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">
                {section.title}
              </h4>
              <ul className="space-y-2 pl-4">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={parentRoute}
                      className="text-gray-600 hover:text-green-600 transition-colors"
                    >
                      {item}
                      {item === "Sell Your Property" && (
                        <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                          New
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMegaMenu, setOpenMegaMenu] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(
    null
  );
  const [dropdownPositions, setDropdownPositions] = useState<
    Record<string, "left" | "right">
  >({});

  const buyRef = useRef<HTMLDivElement>(null);
  const rentRef = useRef<HTMLDivElement>(null);
  const shortletRef = useRef<HTMLDivElement>(null);
  const newProjectsRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const calculateDropdownPosition = (
    triggerRef: React.RefObject<HTMLDivElement | null>,
    menuKey: string
  ) => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownMinWidth = 400; // Estimated minimum dropdown width

    const spaceOnRight = viewportWidth - triggerRect.right;
    const shouldPositionRight =
      spaceOnRight < dropdownMinWidth && triggerRect.left > dropdownMinWidth;

    setDropdownPositions((prev) => ({
      ...prev,
      [menuKey]: shouldPositionRight ? "right" : "left",
    }));
  };

  const handleMouseEnter = (menu: string) => {
    const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      buy: buyRef,
      rent: rentRef,
      shortlet: shortletRef,
      newProjects: newProjectsRef,
      more: moreRef,
    };
    const ref = refMap[menu];
    calculateDropdownPosition(ref, menu);
    setOpenMegaMenu(menu);
  };

  const handleMouseLeave = () => {
    setOpenMegaMenu(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (openMegaMenu) {
        const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
          buy: buyRef,
          rent: rentRef,
          shortlet: shortletRef,
          newProjects: newProjectsRef,
          more: moreRef,
        };
        calculateDropdownPosition(refMap[openMegaMenu], openMegaMenu);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [openMegaMenu]);

  const handleMobileSectionToggle = (section: string) => {
    setOpenMobileSection(openMobileSection === section ? null : section);
  };

  return (
    <nav className="bg-white  shadow-sm  sticky top-0 left-0 right-0 z-40 pb-6 pt-6">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <VeriPropertyLogo />

            <div className="flex items-center space-x-8">
              <div
                ref={buyRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("buy")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors">
                  <span>Sales</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <MegaMenu
                  items={buyMenuItems}
                  isOpen={openMegaMenu === "buy"}
                  onClose={handleMouseLeave}
                  position={dropdownPositions.buy || "left"}
                  triggerRef={buyRef}
                />
              </div>

              <div
                ref={rentRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("rent")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors">
                  <span>Rent</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <MegaMenu
                  items={rentMenuItems}
                  isOpen={openMegaMenu === "rent"}
                  onClose={handleMouseLeave}
                  position={dropdownPositions.rent || "left"}
                  triggerRef={rentRef}
                />
              </div>

              <div
                ref={shortletRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("shortlet")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors">
                  <span>Shortlet</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <MegaMenu
                  items={shortletMenuItems}
                  isOpen={openMegaMenu === "shortlet"}
                  onClose={handleMouseLeave}
                  position={dropdownPositions.shortlet || "left"}
                  triggerRef={shortletRef}
                />
              </div>

              {/* Guides */}
              <Link
                href="/guides"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Guides
              </Link>

              {/* About Us */}
              {/* <Link
                href="/about-us"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                About Us
              </Link> */}

              {/* Contact Us */}
              {/* <Link
                href="/contact-us"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Contact Us
              </Link> */}
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Register/Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Medium Screen Navigation */}
      <div className="hidden md:block lg:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <VeriPropertyLogo />
            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="block md:hidden">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <VeriPropertyLogo />
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="max-h-screen overflow-y-auto">
            <MobileMenuSection
              title="Sales"
              items={buyMenuItems}
              isOpen={openMobileSection === "buy"}
              onToggle={() => handleMobileSectionToggle("buy")}
            />
            <MobileMenuSection
              title="Rent"
              items={rentMenuItems}
              isOpen={openMobileSection === "rent"}
              onToggle={() => handleMobileSectionToggle("rent")}
            />
            <MobileMenuSection
              title="Shortlet"
              items={shortletMenuItems}
              isOpen={openMobileSection === "shortlet"}
              onToggle={() => handleMobileSectionToggle("shortlet")}
            />
            <div className="border-b border-gray-200">
              <Link
                href="/guides"
                className="block px-4 py-4 text-gray-900 hover:text-green-600 transition-colors"
              >
                Guides
              </Link>
            </div>
            {/* <div className="border-b border-gray-200">
              <Link
                href="/about-us"
                className="block px-4 py-4 text-gray-900 hover:text-green-600 transition-colors"
              >
                About Us
              </Link>
            </div>
            <div className="border-b border-gray-200">
              <Link
                href="/contact-us"
                className="block px-4 py-4 text-gray-900 hover:text-green-600 transition-colors"
              >
                Contact Us
              </Link>
            </div> */}
            <div className="p-4">
              <Link
                href="/auth/login"
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
              >
                Register/Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
