import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Attempt to scroll main document
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Find any custom scrollable containers used in the pages and scroll them to top
    const scrollableContainers = document.querySelectorAll('.overflow-y-auto, .custom-scrollbar');
    scrollableContainers.forEach(container => {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
