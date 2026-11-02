import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  MapPin,
  Menu,
  Phone,
  Play,
  Search,
  X,
} from 'lucide-react';

const photo = (id: string, width = 1500) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86`;

type Property = {
  name: string;
  type: string;
  location: string;
  image: string;
  status: string;
  price: string;
};

const projects: Property[] = [
  {
    name: 'The Grand Arbor', type: 'Residential', location: 'Sector 65, Gurugram',
    image: photo('photo-1600607687920-4e2a09cf159d'), status: 'Now selling', price: 'From ₹ 2.8 Cr*',
  },
  {
    name: 'The Veranda', type: 'Residential', location: 'Sector 113, Delhi NCR',
    image: photo('photo-1600566753086-00f18fb6b3ea'), status: 'New launch', price: 'From ₹ 3.4 Cr*',
  },
  {
    name: 'Avenue 25', type: 'Retail', location: 'MG Road, Gurugram',
    image: photo('photo-1486406146926-c627a92ad1ab'), status: 'Limited spaces', price: 'Retail destinations',
  },
  {
    name: 'The Crown', type: 'Residential', location: 'Sector 94, Noida',
    image: photo('photo-1600607687939-ce8a6c25118c'), status: 'Under construction', price: 'From ₹ 2.2 Cr*',
  },
];

const categories = [
  { title: 'Homes', kicker: 'RESIDENTIAL', copy: 'A considered collection of homes made for the way you live.', image: photo('photo-1600566753190-17f0baa2a6c3'), id: 'residential' },
  { title: 'Retail', kicker: 'RETAIL', copy: 'Vibrant places where commerce and community meet.', image: photo('photo-1486406146926-c627a92ad1ab'), id: 'retail' },
  { title: 'Workspaces', kicker: 'COMMERCIAL', copy: 'Spaces designed to move ambitious businesses forward.', image: photo('photo-1497366811353-6870744d04b2'), id: 'commercial' },
  { title: 'Stay', kicker: 'HOSPITALITY', copy: 'Effortless stays, thoughtful service, and room to recharge.', image: photo('photo-1600607687939-ce8a6c25118c'), id: 'hospitality' },
  { title: 'Leasing', kicker: 'LEASING', copy: 'Flexible space for ideas ready to take shape.', image: photo('photo-1497366754035-f200968a6e72'), id: 'leasing' },
];

const stories = [
  { title: 'A new address for a more considered way of living', category: 'DESIGN & LIVING', date: '12 OCT 2025', image: photo('photo-1600607687939-ce8a6c25118c') },
  { title: 'Making room for nature in the modern city', category: 'OUR APPROACH', date: '24 SEP 2025', image: photo('photo-1600566753190-17f0baa2a6c3') },
  { title: 'A destination that brings the neighbourhood together', category: 'COMMUNITY', date: '08 AUG 2025', image: photo('photo-1511818966892-d7d671e672a2') },
];

const testimonials = [
  { quote: 'The whole experience felt thoughtful. From the first visit, we could picture our family here.', name: 'Ananya & Rohan Mehta', home: 'Residents at The Grand Arbor', image: photo('photo-1544005313-94ddf0286df2', 900) },
  { quote: 'A place that feels peaceful and connected at the same time. That balance is hard to find.', name: 'Sanjay Khanna', home: 'Resident at The Veranda', image: photo('photo-1500648767791-00dcc994a43e', 900) },
  { quote: 'The design details and the care in the planning make this feel like a long-term home.', name: 'Ritika Sharma', home: 'Resident at The Crown', image: photo('photo-1506794778202-cad84cf45f1d', 900) },
];

const news = [
  { title: 'RE Builders announces its next landmark community in Gurugram', desc: 'A new collection of homes is taking shape, bringing considered design and everyday ease together.', date: '18 October 2025' },
  { title: 'Building neighbourhoods with more room for nature', desc: 'Our latest design approach makes green space a part of daily life, from shaded walks to open courtyards.', date: '02 October 2025' },
  { title: 'RE Builders wins recognition for thoughtful design', desc: 'The award recognises a commitment to creating enduring places for people and the communities around them.', date: '12 September 2025' },
];

function BrandMark({ dark = false }: { dark?: boolean }) {
  return <a className={`brand ${dark ? 'brand-dark' : ''}`} href="#home" aria-label="RE Builders home">
    <span className="brand-symbol" aria-hidden="true"><i>R</i><i>E</i></span>
    <span className="brand-word"><strong>RE</strong><small>BUILDERS</small></span>
  </a>;
}

function SectionHeading({ eyebrow, title, note }: { eyebrow?: string; title: string; note?: string }) {
  return <div className="section-heading reveal">
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {note && <p>{note}</p>}
  </div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [filterLabel, setFilterLabel] = useState('');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activeNews, setActiveNews] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const visibleProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesType = !category || project.type.toLowerCase() === category.toLowerCase();
      const matchesCity = !city || project.location.toLowerCase().includes(city.toLowerCase());
      const matchesBudget = !budget || (budget === '2' ? project.price.includes('2') : budget === '3' ? project.price.includes('3') : project.price.includes('5'));
      return matchesType && matchesCity && matchesBudget;
    });
  }, [category, city, budget]);

  const scrollCarousel = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({ left: direction * 420, behavior: 'smooth' });
  };

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parts = [category, city, budget && (budget === '2' ? '₹ 2–3 Cr' : budget === '3' ? '₹ 3–5 Cr' : '₹ 5 Cr+')].filter(Boolean);
    setFilterLabel(parts.length ? parts.join(' · ') : 'All developments');
    document.querySelector('#developments')?.scrollIntoView({ behavior: 'smooth' });
  };

  const onContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSent(true);
  };

  const openContact = () => {
    setFormSent(false);
    setModalOpen(true);
    setMenuOpen(false);
  };

  const moveTestimonial = (direction: -1 | 1) => {
    setTestimonialIndex((index) => (index + direction + testimonials.length) % testimonials.length);
  };

  return <>
    <header className={`site-header ${scrolled ? 'site-header-solid' : ''}`}>
      <div className="header-inner">
        <BrandMark />
        <nav className="main-nav" aria-label="Primary navigation">
          <a href="#story">Our story</a>
          <a href="#developments">Developments <ChevronDown size={13} /></a>
          <a href="#experience">Our approach</a>
          <a href="#journal">Journal</a>
        </nav>
        <div className="header-actions">
          <button className="search-icon" aria-label="Find a development" onClick={() => document.querySelector('#finder')?.scrollIntoView({ behavior: 'smooth' })}><Search size={18} /></button>
          <button className="button button-lime header-enquire" onClick={openContact}>Enquire now <ArrowUpRight size={16} /></button>
          <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </div>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-media">
          <img className="hero-poster" src={photo('photo-1600596542815-ffad4c1539a9', 2400)} alt="Modern home set in a landscaped garden" />
        </div>
        <div className="hero-shade" />
        <div className="hero-content page-width">
          <div className="hero-copy reveal is-visible">
            <span className="hero-kicker"><span /> Places made for living</span>
            <h1>Find your<br /><em>place in life.</em></h1>
            <p>Thoughtful spaces. A life that feels like yours.</p>
            <a className="hero-scroll" href="#story"><span>Explore RE Builders</span><ArrowDown size={16} /></a>
          </div>
          <form className="property-finder" id="finder" onSubmit={onSearch}>
            <div className="finder-intro"><span>Find your place</span><strong>What are you looking for?</strong></div>
            <label className="finder-field"><span>Property type</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Any type</option><option value="Residential">Residential</option><option value="Retail">Retail</option><option value="Commercial">Commercial</option></select><ChevronDown size={16} /></label>
            <label className="finder-field"><span>Location</span><select value={city} onChange={(event) => setCity(event.target.value)}><option value="">Any location</option><option value="Gurugram">Gurugram</option><option value="Delhi">Delhi NCR</option><option value="Noida">Noida</option></select><ChevronDown size={16} /></label>
            <label className="finder-field"><span>Price range</span><select value={budget} onChange={(event) => setBudget(event.target.value)}><option value="">Any budget</option><option value="2">₹ 2–3 Cr</option><option value="3">₹ 3–5 Cr</option><option value="5">₹ 5 Cr+</option></select><ChevronDown size={16} /></label>
            <button className="finder-submit" type="submit"><Search size={17} /><span>Search</span></button>
          </form>
        </div>
        <div className="hero-index"><span>01</span><i /> 04</div>
      </section>

      <section className="intro-section" id="story">
        <div className="intro-grid page-width">
          <div className="intro-label reveal"><span className="eyebrow">A PLACE TO BEGIN</span><span className="intro-vertical">DESIGNED AROUND YOU</span></div>
          <div className="intro-copy reveal">
            <h2>Building places<br />that <em>feel like home.</em></h2>
            <p>At RE Builders, we believe a home is more than four walls. It is the light in the morning, the familiar faces on your street, and the quiet confidence of knowing you belong. We bring people, architecture, and the natural world together to create places with a lasting sense of meaning.</p>
            <a className="text-link" href="#experience">Discover our story <span><ArrowRight size={17} /></span></a>
          </div>
          <div className="intro-aside reveal"><span className="intro-aside-line" /><p>Places shaped by<br /><strong>purpose &amp; possibility.</strong></p><span className="intro-aside-number">RE / 01</span></div>
        </div>
      </section>

      <section className="news-strip" aria-label="Latest news">
        <div className="news-strip-inner page-width">
          <div className="news-label"><span className="eyebrow">IN THE NEWS</span><span className="news-dash" /></div>
          <div className="news-ticker" aria-live="polite"><span className="news-date">{news[activeNews].date}</span><strong>{news[activeNews].title}</strong><a href="#journal" aria-label="Read latest news"><ArrowUpRight size={18} /></a></div>
          <div className="news-controls"><button aria-label="Previous update" onClick={() => setActiveNews((activeNews + news.length - 1) % news.length)}><ArrowLeft size={16} /></button><button aria-label="Next update" onClick={() => setActiveNews((activeNews + 1) % news.length)}><ArrowRight size={16} /></button></div>
        </div>
      </section>

      <section className="metrics-section">
        <div className="metrics-inner page-width reveal">
          <div className="metrics-heading"><span className="eyebrow">GROUNDED IN EXPERIENCE</span><h2>Creating more<br /><em>than addresses.</em></h2></div>
          <div className="metric"><strong>25<span>+</span></strong><small>Years of experience</small></div>
          <div className="metric"><strong>42</strong><small>Places created</small></div>
          <div className="metric"><strong>18<span>K</span></strong><small>Happy residents</small></div>
          <div className="metric"><strong>06</strong><small>Cities and growing</small></div>
        </div>
      </section>

      <section className="projects-section section-pad" id="developments">
        <div className="page-width">
          <div className="section-topline reveal"><SectionHeading eyebrow="MADE TO MATTER" title="Featured developments" note="Discover a place to put down roots, make your mark, and feel at home." />
            <div className="carousel-buttons"><button aria-label="Previous developments" onClick={() => scrollCarousel(-1)}><ArrowLeft /></button><button aria-label="Next developments" onClick={() => scrollCarousel(1)}><ArrowRight /></button></div>
          </div>
          {filterLabel && <div className="filter-result"><span>Showing: {filterLabel}</span><button onClick={() => { setCategory(''); setCity(''); setBudget(''); setFilterLabel(''); }}>Clear filters <X size={14} /></button></div>}
          <div className="project-carousel" ref={carouselRef}>
            {visibleProjects.length ? visibleProjects.map((project) => <article className="project-card" key={project.name}>
              <a href="#contact" className="project-image" onClick={(event) => { event.preventDefault(); openContact(); }}>
                <img src={project.image} alt={`${project.name}, a RE Builders ${project.type.toLowerCase()} development`} loading="lazy" />
                <span className="project-status">{project.status}</span><span className="project-arrow"><ArrowUpRight size={19} /></span>
              </a>
              <div className="project-info"><span className="eyebrow">{project.type} <i /> {project.location}</span><div><h3>{project.name}</h3><span className="project-price">{project.price}</span></div></div>
            </article>) : <div className="empty-projects"><Building2 size={24} /><h3>Nothing found just yet</h3><p>Try a different location or clear your filters to see all developments.</p><button className="text-link" onClick={() => { setCategory(''); setCity(''); setBudget(''); setFilterLabel(''); }}>View all developments <ArrowRight size={16} /></button></div>}
          </div>
          <div className="section-footer reveal"><span className="line-note">A PLACE FOR EVERY CHAPTER</span><a className="text-link" href="#contact" onClick={(event) => { event.preventDefault(); openContact(); }}>View all developments <span><ArrowRight size={17} /></span></a></div>
        </div>
      </section>

      <section className="verticals-section section-pad" id="experience">
        <div className="page-width">
          <div className="verticals-heading reveal"><div><SectionHeading eyebrow="LIFE, IN ALL ITS FORMS" title="A place for every part of life" /></div><p>From the first key to a new business venture, our places are made to support the lives unfolding within them.</p></div>
          <div className="verticals-grid">
            {categories.map((item, index) => <a className={`vertical-card vertical-${index + 1} reveal`} href="#developments" key={item.id} onClick={() => { if (item.id === 'residential' || item.id === 'retail') setCategory(item.id === 'residential' ? 'Residential' : 'Retail'); }}>
              <img src={item.image} alt="" loading="lazy" /><span className="vertical-shade" /><span className="vertical-copy"><small>{item.kicker}</small><strong>{item.title}</strong><span className="vertical-desc">{item.copy}</span><i><ArrowUpRight size={18} /></i></span>
            </a>)}
          </div>
        </div>
      </section>

      <section className="feature-band">
        <div className="feature-image"><img src={photo('photo-1600607688969-a5bfcd646154')} alt="A thoughtfully designed modern community" loading="lazy" /></div>
        <div className="feature-copy reveal"><span className="eyebrow">OUR POINT OF VIEW</span><h2>Designed for today.<br /><em>Made to belong.</em></h2><p>Good design quietly changes the way a day feels. We start with the details that matter: a sense of arrival, a room to breathe, and the comfort of knowing everything is in its right place.</p><a className="text-link" href="#story">How we build <span><ArrowRight size={17} /></span></a></div>
        <span className="feature-number">02 / 04</span>
      </section>

      <section className="journal-section section-pad" id="journal">
        <div className="page-width">
          <div className="section-topline reveal"><SectionHeading eyebrow="NOTES FROM RE" title="Stories & perspectives" note="A closer look at the people, ideas, and places shaping our world." /><a className="text-link journal-all" href="#journal">Visit our journal <span><ArrowRight size={17} /></span></a></div>
          <div className="journal-grid">{stories.map((story, index) => <article className={`journal-card reveal journal-card-${index + 1}`} key={story.title}>
            <a href="#journal" className="journal-image"><img src={story.image} alt="" loading="lazy" /><span className="journal-read"><ArrowUpRight size={18} /></span></a>
            <div className="journal-meta"><span>{story.category}</span><span>{story.date}</span></div><h3><a href="#journal">{story.title}</a></h3>
          </article>)}</div>
        </div>
      </section>

      <section className="testimonial-section section-pad">
        <div className="page-width testimonial-layout">
          <div className="testimonial-lead reveal"><span className="eyebrow">LIFE AT RE</span><h2>Our people.<br /><em>Our greatest story.</em></h2><p>Every place is made meaningful by the lives lived there. These are a few of the stories our residents have shared.</p><div className="testimonial-controls"><button aria-label="Previous testimonial" onClick={() => moveTestimonial(-1)}><ArrowLeft /></button><span>0{testimonialIndex + 1}<i />0{testimonials.length}</span><button aria-label="Next testimonial" onClick={() => moveTestimonial(1)}><ArrowRight /></button></div></div>
          <article className="testimonial-card reveal" key={testimonialIndex}>
            <div className="testimonial-photo"><img src={testimonials[testimonialIndex].image} alt="Resident portrait" loading="lazy"/><span className="testimonial-play"><Play size={17} fill="currentColor" /></span></div>
            <div className="testimonial-quote"><span className="quote-mark">“</span><blockquote>{testimonials[testimonialIndex].quote}</blockquote><div className="quote-credit"><strong>{testimonials[testimonialIndex].name}</strong><span>{testimonials[testimonialIndex].home}</span></div></div>
          </article>
        </div>
      </section>

      <section className="contact-cta" id="contact">
        <div className="contact-cta-inner page-width reveal"><div><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Come find your<br /><em>place with us.</em></h2></div><button className="button button-lime" onClick={openContact}>Talk to our team <ArrowUpRight size={18} /></button><span className="cta-orbit" aria-hidden="true">RE</span></div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="footer-main page-width">
        <div className="footer-brand-column"><BrandMark dark /><p>Creating thoughtful places<br />for a life well lived.</p><div className="social-links"><a href="#instagram" aria-label="Instagram"><span className="social-glyph">◎</span></a><a href="#facebook" aria-label="Facebook"><span className="social-glyph">f</span></a><a href="#linkedin" aria-label="LinkedIn"><span className="social-glyph social-in">in</span></a><a href="#youtube" aria-label="YouTube"><span className="social-glyph social-play">▶</span></a></div></div>
        <div className="footer-column"><span className="footer-heading">Explore</span><a href="#story">Our story</a><a href="#developments">Developments</a><a href="#experience">Our approach</a><a href="#journal">Journal</a></div>
        <div className="footer-column"><span className="footer-heading">Find us</span><p><MapPin size={15} /> 12th Floor, Horizon Plaza<br /><span>Golf Course Extension Road,<br />Gurugram, Haryana 122018</span></p><a href="tel:+911244800880"><Phone size={14} /> +91 124 480 0880</a><a href="mailto:hello@rebuilders.in">hello@rebuilders.in</a></div>
        <div className="footer-newsletter"><span className="footer-heading">A little note from RE</span><p>Occasional updates on new places, ideas, and things worth knowing.</p><form onSubmit={(event) => { event.preventDefault(); (event.currentTarget as HTMLFormElement).reset(); }}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required /><button aria-label="Subscribe"><ArrowRight size={18} /></button></form><small>By subscribing, you agree to our privacy policy.</small></div>
      </div>
      <div className="footer-bottom page-width"><span>© 2025 RE Builders. All rights reserved.</span><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#disclaimer">Disclaimer</a></div><span>Made for the life you imagine.</span></div>
    </footer>

    <div className="quick-actions"><button className="quick-mail" aria-label="Email RE Builders" onClick={openContact}><span><Phone size={16} /></span></button><a href="https://wa.me/911244800880" className="quick-whatsapp" aria-label="WhatsApp RE Builders">✆</a></div>

    {menuOpen && <div className="menu-overlay" role="dialog" aria-modal="true" aria-label="Website navigation">
      <div className="menu-top"><BrandMark dark /><button className="menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={25} /></button></div>
      <div className="menu-body page-width"><div className="menu-nav-list"><span className="eyebrow">EXPLORE RE</span><a href="#story" onClick={() => setMenuOpen(false)}>Our story <ArrowUpRight /></a><a href="#developments" onClick={() => setMenuOpen(false)}>Developments <ArrowUpRight /></a><a href="#experience" onClick={() => setMenuOpen(false)}>Our approach <ArrowUpRight /></a><a href="#journal" onClick={() => setMenuOpen(false)}>Journal <ArrowUpRight /></a><button onClick={openContact}>Contact us <ArrowUpRight /></button></div><div className="menu-side"><span className="eyebrow">FIND YOUR PLACE</span><a href="#developments" onClick={() => { setCategory('Residential'); setMenuOpen(false); }}>Residential <span>03 places <ArrowRight /></span></a><a href="#developments" onClick={() => { setCategory('Retail'); setMenuOpen(false); }}>Retail <span>01 place <ArrowRight /></span></a><p>Let’s make room for what matters.</p></div></div>
      <div className="menu-bottom page-width"><span>Gurugram · Delhi NCR · Noida</span><a href="tel:+911244800880">+91 124 480 0880</a><div className="social-links"><a href="#instagram" aria-label="Instagram"><span className="social-glyph">◎</span></a><a href="#linkedin" aria-label="LinkedIn"><span className="social-glyph social-in">in</span></a></div></div>
    </div>}

    {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
      <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" aria-label="Close enquiry form" onClick={() => setModalOpen(false)}><X size={21} /></button>
        {!formSent ? <><span className="eyebrow">WE’RE HERE TO HELP</span><h2 id="modal-title">Let’s find your<br /><em>place together.</em></h2><p>Share a few details and our team will be in touch shortly.</p><form className="contact-form" onSubmit={onContact}><div className="form-row"><label>First name<input type="text" name="firstName" placeholder="Your name" required /></label><label>Last name<input type="text" name="lastName" placeholder="Your surname" /></label></div><label>Email address<input type="email" name="email" placeholder="you@example.com" required /></label><label>Phone number<input type="tel" name="phone" placeholder="+91" required /></label><label>Interested in<select name="interest" defaultValue=""><option value="" disabled>Select a development</option>{projects.map((project) => <option key={project.name}>{project.name}</option>)}</select></label><label className="consent-check"><input type="checkbox" required /><span>I agree to be contacted by RE Builders about my enquiry.</span></label><button className="button button-blue" type="submit">Send enquiry <ArrowRight size={17} /></button><small>Your information is kept private and secure.</small></form></> : <div className="form-success"><span className="success-icon"><Check size={25} /></span><span className="eyebrow">THANK YOU</span><h2 id="modal-title">We’ll be in touch<br /><em>very soon.</em></h2><p>Your enquiry has been received. A member of our team will reach out shortly.</p><button className="button button-blue" onClick={() => setModalOpen(false)}>Back to RE Builders <ArrowRight size={17} /></button></div>}
      </div>
    </div>}
  </>;
}

export default App;
