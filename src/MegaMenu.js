// src/components/MegaMenu.jsx
import React, { useState } from 'react';
import './MegaMenu.css';

const MegaMenu = ({ currentMenuItem, setCurrentMenuItem }) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuData = [
    {
      title: 'Home',
      id: 'home',
      content: 'Home Content',
    },
    {
      title: 'About',
      id: 'about',
      content: 'About Content',
    },
    {
      title: 'Services',
      id: 'services',
      content: [
        {
          title: 'Web Development',
          id: 'services::web-development',
          items: [
            { title: 'Frontend Development', id: 'services::web-development::frontend' },
            { title: 'Backend Development', id: 'services::web-development::backend' },
            { title: 'Full Stack Development', id: 'services::web-development::fullstack' },
            { title: 'Responsive Design', id: 'services::web-development::responsive' },
            { title: 'Web Performance Optimization', id: 'services::web-development::performance' },
          ],
        },
        { title: 'Mobile Development', id: 'services::mobile-development', description: 'Mobile Development Description' },
        { title: 'SEO Services', id: 'services::seo-services', description: 'SEO Services Description' },
      ],
    },
    {
      title: 'Contact',
      id: 'contact',
      content: 'Contact Content',
    },
  ];

  const handleItemClick = (id) => {
    setCurrentMenuItem(id);
  };

  const isItemActive = (id) => {
    return currentMenuItem === id || currentMenuItem?.startsWith(id + '::');
  };

  return (
    <nav className="mega-menu">
      <ul className="menu">
        {menuData.map((menuItem, index) => (
          <li
            key={index}
            id={menuItem.id}
            className={`menu-item ${isItemActive(menuItem.id) ? 'active' : ''}`}
            onMouseEnter={() => setActiveMenu(index)}
            onMouseLeave={() => setActiveMenu(null)}
            onClick={() => handleItemClick(menuItem.id)}
          >
            {menuItem.title}
            {activeMenu === index && menuItem.content && (
              <div className="mega-menu-content">
                {Array.isArray(menuItem.content) ? (
                  <div className="submenu">
                    {menuItem.content.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        id={subItem.id}
                        className={`submenu-item ${isItemActive(subItem.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(subItem.id);
                        }}
                      >
                        <h4>{subItem.title}</h4>
                        {subItem.items ? (
                          <div className="subsubmenu">
                            {subItem.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                id={item.id}
                                className={`subsubmenu-item ${currentMenuItem === item.id ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemClick(item.id);
                                }}
                              >
                                {item.title}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>{subItem.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="single-content">{menuItem.content}</div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MegaMenu;
