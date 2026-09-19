import style from "../../styles/landing.module.css";

const NavBar = () =>{

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

function MainHeading() {
    const fidelChars = ["ሀ", "ለ", "መ", "ረ", "ሰ", "በ", "ተ", "ነ", "የ", "ከ", "ወ", "አ", "ኆ", "ዎ", "ዔ", "ዦ"];

    return (
        <div
            style={{
                position: 'relative', 
                // overflow: 'hidden',  
            }}
        >
            {/* Background */}
            {fidelChars.map((char, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        fontSize: '3rem',
                        color: '#2563eb',
                        opacity: 0.2,
                        animation: `float ${8 + Math.random() * 4}s linear infinite`,
                        animationDelay: `${i * 0.5}s`,
                        pointerEvents: 'none'
                    }}
                >
                    {char}
                </div>
            ))}

            {/* Foreground */}
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <h1 style={{ fontSize: '3em' }}>Learn the Fidel Script</h1>
                <p style={{ marginTop: '40px', fontSize: '2em' }}>
                    One letter at a time
                </p>
            </div>
        </div>
    );
}


export default function LandingPage(){

    const firstTitle = "20+ Lessons";
    const firstText = "Learn all the Amharic consonant families in a structured path";
    
    const secondTitle = "Interactive Quizzes";
    const secondText = "Text your recongnition with multiple-choice quizzes and review modes that reinforce previous lessons";

    const thirdTitle = "Tracing Practice";
    const thirdText = "Build muscle memory by practicing each letter form";

    return(
        <>
            <NavBar/>
            <MainHeading />
        </>
    )
};