import style from "../../styles/landing.module.css";

interface InfoBoxProps {
    title: string;
    text: string;
};

function NavBar(){

    return (
        <nav className={style.navbar}>
            <div className={style.navbar_title}>
                    <span className={style.navbar_foreign}>ፊደል</span>
                    <div className={style.navbar_english}>
                        <span>Fidel</span>
                        <span>Learn </span>
                    </div>
            </div>
            <div className={style.navbar_buttons}>
                <button className={style.navbar_button_login}>Login</button>
                <button className={style.navbar_button_signup}>Signup</button>
            </div>
        </nav>
    )
};

function Header() {
    const fidelChars: string[] = ["ሀ", "ለ", "መ", "ረ", "ሰ", "በ", "ተ", "ነ", "የ", "ከ", "ወ", "አ", "ኆ", "ዎ", "ዔ", "ዦ"];
    const fidelCharsInterval: number = 100 / fidelChars.length;
    return (
        <div className={style.header_layout}>
            {/* Background */}
            {fidelChars.map((char, i) => (
                <div className={style.header_background}
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${i * fidelCharsInterval}%`,
                        top: `${Math.random() * 100}%`,
                        animationDuration: `${8 + Math.random() * 4}s`,
                        animationDelay: `${i * 0.5}s`,
                     
                    }}
                >
                    {char}
                </div>
            ))}

            {/* Foreground */}
            <div className={style.header_foreground}>
                <h1 className={style.header_foreground_title}>Learn the Fidel Script</h1>
                <p className={style.header_foreground_subtitle}>
                    Used by more than 50 million people worldwide
                </p>
            </div>
        </div>
    );
}

function InfoBox({ title, text }: InfoBoxProps) {
    return (
        <div className={style.infobox}>
            <h3 className={style.infobox_title}>{title}</h3>
            <span className={style.infobox_text}>{text}</span>
        </div>
    )
}


export default function LandingPage(){

    const firstTitle: string = "200+ Characters";
    const firstText: string = "Learn all the Amharic consonant families in a structured path";
    
    const secondTitle: string = "Interactive Exercises";
    const secondText: string = "Navigate through a series of exercises to reinforce your learning";



    return(
        <>
            <NavBar/>
            <Header />
            <div className={style.infobox_layout}>
                <InfoBox title={firstTitle} text={firstText} />
                <InfoBox title={secondTitle} text={secondText} />
            </div>
        </>
    )
};