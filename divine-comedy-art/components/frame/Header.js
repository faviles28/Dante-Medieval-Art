import Link from "next/link";

export default function Header() {
    return (
        <>
          <div className="header-container">
            <div className='header-div'>
              <Link className='subtle-link' href='/'><h1 className='highlighted'><b>Dante Through Medieval Art</b></h1></Link>
            </div>
          </div>
        </>
    );
};