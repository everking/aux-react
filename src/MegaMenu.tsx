// src/components/MegaMenu.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MegaMenu.css';

const MegaMenu = ({ currentMenuItem, setCurrentMenuItem }: any) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const menuData = [
    {
      title: 'Home',
      id: 'home',
      content: 'Home Content',
    },
    {
      title: 'Family',
      id: 'family',
      content: [
        {
          title: 'Whole Child',
          id: 'family::whole-child',
          items: [
            { title: 'Academic', id: 'family::whole-child::academic' },
            { title: 'Spiritual', id: 'family::whole-child::spiritual' },
            { title: 'Sports', id: 'family::whole-child::sports' },
            { title: 'Culture', id: 'family::whole-child::culture' },
            { title: 'Faith & Reason', id: 'family::whole-child::faith-reason' },
          ],
        },
        { 
          title: 'Spiritual', id: 'family::spiritual', description: 'Spiritual',
          items: [
            { title: 'Biblical', id: 'family::spiritual::biblical' },
            { title: 'Prayers', id: 'family::spiritual::prayers' },
            { title: 'Formation', id: 'family::spiritual::formation' },
            { title: 'Readings', id: 'family::spiritual::readings' },
            { title: 'Catechism', id: 'family::spiritual::ccc' },
            { title: 'Mentoring', id: 'family::spiritual::mentoring' },            
          ]

        },
        { 
          title: 'Activities', id: 'family::activities', description: 'Activities',
          items: [
            { title: 'Chat', id: 'family::activities::chat' },
            { title: 'Field Outing', id: 'family::activities::field-outing' },
            { title: 'Bible study', id: 'family::activities::bible-study' },
            { title: 'Recollections', id: 'family::activities::recollections' },
            { title: 'Study weekend', id: 'family::activities::study-weekend' },
          ]
        },
      ],
    },
    {
      title: 'High School / College',
      id: 'highSchool',
      content: [
      {
          title: '',
          id: 'family::sub',
          items: [
            { title: 'Reading List', id: 'highSchool::sub::reading-list' },
            { title: 'Friendship clubs', id: 'highSchool::sub::fiendship-clubs' },
            { title: 'Movie Club', id: 'highSchool::sub::movie-club' },
            { title: 'Sports Group', id: 'highSchool::sub::sports-group' },
            { title: 'Game Reviews', id: 'highSchool::sub::game-reviews' },
            { title: 'Mentoring', id: 'highSchool::sub::mentoring' },
            { title: 'Counseling', id: 'highSchool::sub::counseling' },
          ]
      }
      ]
    },
    {
      title: 'Contact',
      id: 'contact',
      content: 'Contact Content',
    },
  ];


  const getArticleId = (currentMenuItem:any) => {
    if (currentMenuItem) {
      if (currentMenuItem.includes("::")) {
        const menuIdArray = currentMenuItem.split("::");
        return menuIdArray[menuIdArray.length-1];
      } else {
        return currentMenuItem;
      }
    }  
  }


  const handleItemClick = (id:any) => {
    const articleId = getArticleId(id);
    navigate(`/auxilium/articles/${articleId}`);
    setCurrentMenuItem(id);
  };

  const isItemActive = (id:any) => {
    return currentMenuItem === id || currentMenuItem?.startsWith(id + '::');
  };

  // menuItem.content
  return (
    <nav className='mega-menu'>
      <ul className='menu'>
        {menuData.map((menuItem:any, index:any) => (
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
                    {menuItem.content.map((subItem:any, subIndex:any) => (
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
                            {subItem.items.map((item:any, itemIndex:any) => (
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
