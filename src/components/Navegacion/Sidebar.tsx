"use client"

import type React from "react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import {
  Box,
  PlusCircle,
  DashCircle,
  FileText,
  FileEarmarkSpreadsheet,
  ChevronDown,
  ArrowLeftRight,
  Database,
  ChevronLeft,
  ChevronRight,
  ArrowsCollapseVertical,
  LayoutSidebar,
  LayoutSidebarInset,
  LayoutTextSidebarReverse,
  LayoutTextSidebar,
} from "react-bootstrap-icons"
import "../../styles/Sidebar.css"
import { connect } from "react-redux"
import type { RootState } from "../../store"
import type { Objeto } from "./Profile"

const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ")
}

export interface NavItem {
  name: string
  href?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  isSubmenu?: boolean
}

interface StateProps {
  objeto: Objeto
}

interface OwnProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

interface Props extends StateProps, OwnProps { }

const Sidebar: React.FC<Props> = ({ objeto, isCollapsed = false, onToggleCollapse }) => {
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({})

  const navigation: NavItem[] = [
    { name: "Inventario", href: "/Inventario", icon: Box },
    { name: "Altas", href: "/Altas", icon: PlusCircle },
    { name: "Traslados", href: "/Traslados", icon: ArrowLeftRight },
    { name: "Bajas", href: "/Bajas", icon: DashCircle },
    { name: "Informes", href: "/Informes", icon: FileText },
  ]

  if (objeto.IdCredencial === 62511) {
    navigation.push({ name: "Mantenedores", href: "/Mantenedores", icon: Database })
  }

  const subMenus: { [key: string]: NavItem[] } = {
    Informes: [{ name: "Listados", href: "/Informes/Listados", icon: FileEarmarkSpreadsheet }],
  }

  const toggleSubMenu = (menuName: string) => {
    if (!isCollapsed) {
      setOpenSubMenus((prev) => ({
        ...prev,
        [menuName]: !prev[menuName],
      }))
    }
  }

  return (
    <div className={`sidebar-container sticky-top d-flex flex-column  ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>

      {/* Header */}
      <div className="text-center text-white">
        <div className="d-flex mx-2 top-0 w-75">
          <div className="text-bg-primary p-1 w-50"></div>
          <div className="text-bg-danger p-1 flex-grow-1 w-75"></div>
        </div>
        <div className={`m-4 ${isCollapsed ? "sidebar-header-collapsed" : ""}`}>
          <NavLink className="navbar-brand fw-semibold fs-5" to="/Inicio" title={isCollapsed ? "SSMSO" : ""}>
            {isCollapsed ? "S" : "SSMSO"}
          </NavLink>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-grow-1">
        {navigation.map((item) => (
          <div key={item.name} className="d-flex flex-column">
            <div className="d-flex align-items-center position-relative">
              <NavLink
                to={item.href!}
                className={({ isActive }) =>
                  classNames(
                    isActive ? "bg-light text-dark" : "text-white",
                    "d-flex align-items-center py-2 px-3 mb-4 rounded-1 text-decoration-none nav-item flex-grow-1",
                    isCollapsed ? "justify-content-center" : "",
                  )
                }
                title={isCollapsed ? item.name : ""}
              >
                <item.icon
                  width={isCollapsed ? 24 : 16}
                  height={isCollapsed ? 24 : 16}
                  className={`flex-shrink-0 ${isCollapsed ? "" : "me-3"}`}
                  aria-hidden="true"
                />
                {!isCollapsed && <p className="w-100 mb-0">{item.name}</p>}
              </NavLink>

              {subMenus[item.name] && !isCollapsed && (
                <button
                  className="btn mb-2 text-white"
                  onClick={() => toggleSubMenu(item.name)}
                  aria-label="Toggle submenu"
                >
                  <ChevronDown
                    width={16}
                    height={16}
                    className={`ms-2 ${openSubMenus[item.name] ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>

            {subMenus[item.name] && openSubMenus[item.name] && !isCollapsed && (
              <div className="ms-4">
                {subMenus[item.name].map((subItem) => (
                  <NavLink
                    key={subItem.name}
                    to={subItem.href!}
                    className={({ isActive }) =>
                      classNames(
                        isActive ? "bg-light text-dark" : "text-white",
                        "d-flex align-items-center py-2 px-3 mb-2 rounded text-decoration-none nav-item",
                      )
                    }
                  >
                    <subItem.icon width={16} height={16} className="me-3 flex-shrink-0" />
                    {subItem.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón de colapsar/expandir abajo */}

      <div className="d-none d-md-flex justify-content-center align-items-end mb-4">

        <button
          type="button"
          className="btn btn-outline-light border-0"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? <LayoutSidebarInset width={24} height={24} /> : <LayoutSidebar width={24} height={24} />}
        </button>
      </div>
    </div>



  )
}

const mapStateToProps = (state: RootState): StateProps => ({
  objeto: state.validaApiLoginReducers,
})

export default connect(mapStateToProps, {})(Sidebar)
