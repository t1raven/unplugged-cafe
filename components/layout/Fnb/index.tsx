import './style.scss'

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export default function Fnb({className, children}: Props) {
  return (
    <div id="site-fnb" className={className}>
      <nav>
        {children}
      </nav>
    </div>
  );
}
