import { useNavigate } from "react-router";
import style from "../../styles/landing.module.css";

interface InfoBoxProps {
    title: string;
    text: string;
};

function NavBar(){
    const navigate = useNavigate();

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
                <button className={style.navbar_button_login} onClick={() => navigate("/login")}>Login</button>
                <button className={style.navbar_button_signup} onClick={() => navigate("/signup")}>Signup</button>
            </div>
        </nav>
    )
};

function Header() {
    const fidelChars: string[] = ["ሀ", "ለ", "መ", "ረ", "ሰ", "በ", "ተ", "ነ", "የ", "ከ", "ወ", "አ", "ኆ", "ዎ", "ዔ", "ዦ"];
    const fidelCharsInterval: number = 100 / fidelChars.length;
    const randomTopPositions: number[] = [
                0.7902610143170294,  0.3398498255354372,
                0.8791680915156241, 0.00998112029453524,
                0.2584888495968378, 0.08028606520347203,
                0.19777457602414783,   0.238366258871759,
                0.30774000353406183,  0.3161782190375746,
                0.7969087149162448,  0.7021184187860707,
                0.19221142611199982,  0.9358757050340594,
                    0.925164842262783,  0.6518336113595524
                ];
    const randomAnimDurationValues: number[] = [
                0.012710735957099706,   0.8775372500097807,
                    0.727731627258736,  0.24885384988390657,
                    0.8889730453584139,   0.9065795187828503,
                    0.589819862260458,   0.7694685133468186,
                    0.9553968489949951,    0.794672367630012,
                    0.6679656007410297,   0.8225292800945663,
                    0.3299942221859742,   0.8336664827087288,
                0.17938240477436618, 0.007854459119529977
                ];
    
    return (
        <div className={style.header_layout}>
            {/* Background */}
            {fidelChars.map((char, i) => (
                <div className={style.header_background}
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${i * fidelCharsInterval}%`,
                        top: `${randomTopPositions[i] * 100}%`,
                        animationDuration: `${8 + randomAnimDurationValues[i] * 2}s`,
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
    const firstText: string = "Learn all the consonant families in a structured path";
    
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