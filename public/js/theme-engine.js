let theme_styles = document.documentElement.style
let icon = document.getElementById("weather-icon")
let period = document.getElementById("time-period")


let weather_type = ""
let prev_type = ""

let globalWeather = []

let primary_color = "#0074a5"
let primary_accent_color = "#3695c1"
let secondary_accent_color = "rgb(23, 73, 116)"

let m_back = "#276e91"
let m_front = "#283e54"

let primary_font_color = "whitesmoke"
let secondary_font_color = "rgb(200, 200, 200)"
let playback_color = "whitesmoke"
let flash_length = "100000s"
let rain_opacity = "0"
let snow_opacity = "0"

let star_opacity = 0;

let primary_theme_color = "white"
let secondary_theme_color = "rgb(241, 251, 255)"


/* -------------------------------------------------------------------------- */
/*                        GRANIM CANVAS GRADIENT (SKY)                        */
/* -------------------------------------------------------------------------- */
let granimInstance = new Granim({
    element: '#granim-canvas',
    name: 'granim',
    opacity: [1,1],
    direction: 'top-bottom',
    defaultStateName: "par_cloudy_night",
    states: {
        "clear_morning": {
            gradients: [
                [
                    {color: '#4E9BAB', pos: .00}, 
                    {color: '#eceac1', pos: .60},
                    {color: '#fed987', pos: .70},
                    {color: '#D0513D', pos: 1.0}
                ]
            ]
        },
        "clear_afternoon": {
            gradients: [
                [
                    {color: '#1868A5', pos: .00}, 
                    {color: '#1868A5', pos: .01},
                    {color: '#AFDFFF', pos: .99},
                    {color: '#AFDFFF', pos: 1.0}
                ]
            ]
        },
        "clear_evening": {
            gradients: [
                [
                    {color: '#603D59', pos: .00}, 
                    {color: '#9E4558', pos: .20},
                    {color: '#FF9D5C', pos: .63},
                    {color: '#F8EBCE', pos: 1.0}
                ]
            ]
        },
        "clear_night": {
            gradients: [
                [
                    {color: '#040918', pos: .00}, 
                    {color: '#040918', pos: .01},
                    {color: '#0E2544', pos: .99},
                    {color: '#0E2544', pos: 1.0}
                ]
            ]
        },

        "par_cloudy_morning": {
            gradients: [
                [
                    {color: '#679CA7', pos: .00}, 
                    {color: '#E7E6CE', pos: .70},
                    {color: '#fed987', pos: .84},
                    {color: '#192f32', pos: 1.0}
                ]
            ]
        },
        "par_cloudy_afternoon": {
            gradients: [
                [
                    {color: '#A2CBD8', pos: .00}, 
                    {color: '#A2CBD8', pos: .01},
                    {color: '#4DA8E1', pos: .99},
                    {color: '#4DA8E1', pos: 1.0}
                ]
            ]
        },
        "par_cloudy_evening": {
            gradients: [
                [
                    {color: '#5F475A', pos: .00}, 
                    {color: '#675459', pos: .20},
                    {color: '#FF9D5C', pos: .63},
                    {color: '#F8EBCE', pos: 1.0}
                ]
            ]
        },
        "par_cloudy_night": {
            gradients: [
                [
                    {color: '#0A131F', pos: .20}, 
                    {color: '#1B2837', pos: .70},
                    {color: '#0A131F', pos: .90},
                    {color: '#0A131F', pos: 1.0}
                ]
            ]
        },

        "cloudy_morning": {
            gradients: [
                [
                    {color: '#7D959B', pos: .0}, 
                    {color: '#ABB9BD', pos: .6},
                    {color: '#FFEEDB', pos: .7},
                    {color: '#FFEEDB', pos: 1.}
                ]
            ]
        },
        "cloudy_afternoon": {
            gradients: [
                [
                    {color: '#C4CBCF', pos: .00}, 
                    {color: '#C4CBCF', pos: .01},
                    {color: '#7D959B', pos: .99},
                    {color: '#7D959B', pos: 1.0}
                ]
            ]
        },
        "cloudy_evening": {
            gradients: [
                [
                    {color: '#564953', pos: .00}, 
                    {color: '#5D5557', pos: .20},
                    {color: '#CEA488', pos: .63},
                    {color: '#EED9AC', pos: 1.0}
                ]
            ]
        },
        "cloudy_night": {
            gradients: [
                [
                    {color: '#1A2029', pos: .20}, 
                    {color: '#1A2029', pos: .70},
                    {color: '#2A313B', pos: .90},
                    {color: '#2A313B', pos: 1.0}
                ]
            ]
        },

        "hazy_morning": {
            gradients: [
                [
                    {color: '#B2B58F', pos: .00}, 
                    {color: '#E7E6CE', pos: .70},
                    {color: '#fed987', pos: .84},
                    {color: '#192f32', pos: 1.0}
                ]
            ]
        },
        "hazy_afternoon": {
            gradients: [
                [
                    {color: '#AABDAC', pos: .00}, 
                    {color: '#AABDAC', pos: .01},
                    {color: '#E7E6CE', pos: .99},
                    {color: '#E7E6CE', pos: 1.0}
                ]
            ]
        },
        "hazy_evening": {
            gradients: [
                [
                    {color: '#85A979', pos: .0}, 
                    {color: '#eceac1', pos: .6},
                    {color: '#fed987', pos: .7},
                    {color: '#D0513D', pos: 1.}
                ]
            ]
        },
        "hazy_night": {
            gradients: [
                [
                    {color: '#1E2223', pos: .20}, 
                    {color: '#1A1E1D', pos: .70},
                    {color: '#202321', pos: .90},
                    {color: '#202321', pos: 1.0}
                ]
            ]
        },

        "snowy_morning": {
            gradients: [
                [
                    {color: '#8790AE', pos: .00}, 
                    {color: '#ADA6BD', pos: .30},
                    {color: '#C7AECC', pos: .60},
                    {color: '#7E92D1', pos: .75}
                ]
            ]
        },
        "snowy_afternoon": {
            gradients: [
                [
                    {color: '#A9C4D8', pos: .0}, 
                    {color: '#7FA2D0', pos: .55},
                    {color: '#AED5F4', pos: .8},
                    {color: '#648CC4', pos: 1.}
                ]
            ]
        },
        "snowy_evening": {
            gradients: [
                [
                    {color: '#404D5D', pos: .0}, 
                    {color: '#5B6B95', pos: .4},
                    {color: '#B28AA1', pos: .6},
                    {color: '#F6B1AB', pos: .7}
                ]
            ]
        },
        "snowy_night": {
            gradients: [
                [
                    {color: '#1A2029', pos: .20}, 
                    {color: '#1A2029', pos: .70},
                    {color: '#2A313B', pos: .90},
                    {color: '#2A313B', pos: 1.0}
                ]
            ]
        },

        "rainy_morning": {
            gradients: [
                [
                    {color: '#4C5464', pos: .0}, 
                    {color: '#777B85', pos: .6},
                    {color: '#A7665F', pos: .7},
                    {color: '#FE8D3D', pos: .8}
                ]
            ]
        },
        "rainy_afternoon": {
            gradients: [
                [
                    {color: '#5D7379', pos: .00}, 
                    {color: '#5D7379', pos: .5},
                    {color: '#8FA2A3', pos: .99},
                    {color: '#8FA2A3', pos: 1.0}
                ]
            ]
        },
        "rainy_evening": {
            gradients: [
                [
                    {color: '#31484F', pos: .00}, 
                    {color: '#575D60', pos: .55},
                    {color: '#BB8D81', pos: .73},
                    {color: '#B5A989', pos: .8}
                ]
            ]
        },
        "rainy_night": {
            gradients: [
                [
                    {color: '#161A22', pos: .00}, 
                    {color: '#161A22', pos: .50},
                    {color: '#1B242D', pos: .70},
                    {color: '#1B242D', pos: 1.0}
                ]
            ]
        },

        "stormy_morning": {
            gradients: [
                [
                    {color: '#1E2731', pos: .0}, 
                    {color: '#413D44', pos: .55},
                    {color: '#785649', pos: .7},
                    {color: '#E4E091', pos: .8}
                ]
            ]
        },
        "stormy_afternoon": {
            gradients: [
                [
                    {color: '#2D353B', pos: .3}, 
                    {color: '#5F7781', pos: .65},
                    {color: '#A5B4AF', pos: .75},
                    {color: '#E4E091', pos: 1.}
                ]
            ]
        },
        "stormy_evening": {
            gradients: [
                [
                    {color: '#363B44', pos: .0}, 
                    {color: '#2D2933', pos: .5},
                    {color: '#4E3544', pos: .6},
                    {color: '#F3A057', pos: .85}
                ]
            ]
        },
        "stormy_night": {
            gradients: [
                [
                    {color: '#131219', pos: .0}, 
                    {color: '#131219', pos: .4},
                    {color: '#242733', pos: .8},
                    {color: '#242733', pos: .85}
                ]
            ]
        },



    }
})


/* -------------------------------------------------------------------------- */
/*                               UPDATE THEME                               */
/* -------------------------------------------------------------------------- */

setInterval(refreshTheme, 2000)
function refreshTheme() {
    if (period.innerHTML != null) {
        updateTheme(icon.innerHTML, period.innerHTML);
        // console.log(icon.innerHTML, period.innerHTML);
    }
}

// JQuery update immediately on force env dropdown update
$("#weatherType").on("change", refreshTheme);
$("#periodType").on("change", refreshTheme);

function updateTheme(icon, timePeriod) {

    
    let weather = ""

    flash_length = "100000s"
    rain_opacity = "0"
    star_opacity = 0
    snow_opacity = "0"
    primary_font_color = "#FFFFFF"
    secondary_font_color = "#CFF9FF"
    

    switch (icon) {
        case "01d":
        case "01n":
            weather = "clear"
            break

        case "02d":
        case "02n":
        case "04d":
        case "04n":
            weather = "par_cloudy"
            break

        case "03d":
        case "03n":
            weather = "cloudy"
            break

        case "50d":
        case "50n":
            weather = "hazy"
            break

        case "13d":
        case "13n":
            weather = "snowy"
            break
        
        case "10d":
        case "10n":
        case "09d":
        case "09n":
            weather = "rainy"
            break

        case "11d":
        case "11n":
            weather = "stormy"
            break
    }

    weather_type = weather + "_" + timePeriod
    globalWeather[0] = weather
    globalWeather[1] = timePeriod


    if (localStorage.getItem("forceEnv") == "true") {
        weather_type = weatherDropDown.value + "_" + periodDropDown.value
        // console.log(weather_type)
    } else {
        if (timePeriod != "Loading...") {
            // console.log(weather_type)
        }
        // console.log(weather_type)
    }

    // clear morning
    if (weather_type == "clear_morning") {
        primary_color = "#4E9BAB"
        primary_accent_color = "#73BEC2"
        secondary_accent_color = "#2E7275"
        primary_font_color = "#FFFFFF"
        secondary_font_color = "#CFF9FF"

        m_back = "#276e91"
        m_front = "#283e54"
    }
    // clear afternoon
    if (weather_type == "clear_afternoon") {
        
        primary_color = "#78A3AC"
        primary_accent_color = "#66C97F"
        secondary_accent_color = "#537D7B"
        // primary_font_color = "#62877C"

        m_back = "#587F66"
        m_front = "#3D5647"
    }
    // clear evening
    if (weather_type == "clear_evening") {
        primary_color = "#4A3E61"
        primary_accent_color = "#9E4558"
        secondary_accent_color = "#1D1F36"

        m_back = "#204474"
        m_front = "#182653"
    }
    // clear night
    if (weather_type == "clear_night") {
        primary_color = "#0E2544"
        primary_accent_color = "#214773"
        secondary_accent_color = "#040918"
        primary_font_color = "#bbbbbb"
        
        star_opacity = 1
        m_back = "#193458"
        m_front = "#0D1735"
    }
    

    // partly cloudy morning
    if (weather_type == "par_cloudy_morning") {
        primary_color = "#679CA7"
        primary_accent_color = "#8CA8AE"
        secondary_accent_color = "#47666C"

        m_back = "#305E75"
        m_front = "#273645"
    }
    // partly cloudy afternoon
    if (weather_type == "par_cloudy_afternoon") {
        primary_color = "#6D8A90"
        primary_accent_color = "#76B386"
        secondary_accent_color = "#4B6462"

        m_back = "#325E75"
        m_front = "#314A42"
    }

    

    // clear evening
    if (weather_type == "par_cloudy_evening") {
        primary_color = "#5F475A"
        primary_accent_color = "#8F6D61"
        secondary_accent_color = "#182653"

        m_back = "#253C5B"
        m_front = "#1D2540"
    }
    // partly cloudy night
    if (weather_type == "par_cloudy_night") {
        primary_color = "#1B2837"
        primary_accent_color = "#274C72"
        secondary_accent_color = "#0A131F"

        star_opacity = .3
        m_back = "#253A56"
        m_front = "#141D36"
    }

    

    // cloudy morning
    if (weather_type == "cloudy_morning") {
        primary_color = "#7D959B"
        primary_accent_color = "#B7BBBE"
        secondary_accent_color = "#5D747A"

        m_back = "#6A757D"
        m_front = "#3E505F"
    }
    // cloudy afternoon
    if (weather_type == "cloudy_afternoon") {
        primary_color = "#7D959B"
        primary_accent_color = "#B7BBBE"
        secondary_accent_color = "#5D747A"

        m_back = "#6A757D"
        m_front = "#3E505F"
    }
    // cloudy evening
    if (weather_type == "cloudy_evening") {
        primary_color = "#858A95"
        primary_accent_color = "#B7BBBE"
        secondary_accent_color = "#6A757D"

        m_back = "#6A757D"
        m_front = "#3E505F"
    }
    // cloudy night
    if (weather_type == "cloudy_night") {
        primary_color = "#48535B"
        primary_accent_color = "#3E484C"
        secondary_accent_color = "#2A313B"

        star_opacity = .1
        m_back = "#3E4347"
        m_front = "#2F3840"
    }

    

    // hazy morning
    if (weather_type == "hazy_morning") {
        primary_color = "#878664"
        primary_accent_color = "#8F8D7D"
        secondary_accent_color = "#777665"

        m_back = "#3E4347"
        m_front = "#2F3840"
    }
    // hazy afternoon
    if (weather_type == "hazy_afternoon") {
        primary_color = "#879381"
        primary_accent_color = "#AABDAC"
        secondary_accent_color = "#464C45"
        
        m_back = "#6A757D"
        m_front = "#464C45"
    }
    // hazy evening
    if (weather_type == "hazy_evening") {
        primary_color = "#5D7157"
        primary_accent_color = "#eceac1"
        secondary_accent_color = "#3E4347"

        m_back = "#3E4347"
        m_front = "#2F3840"
    }
    // hazy night
    if (weather_type == "hazy_night") {
        primary_color = "#323C44"
        primary_accent_color = "#383B2B"
        secondary_accent_color = "#1A1A1A"

        star_opacity = .1
        m_back = "#2C3133"
        m_front = "#24292E"
    }

    // weather_type = "rainy_evening"

    // snowy morning
    if (weather_type == "snowy_morning") {
        primary_color = "#A5ADCF"
        primary_accent_color = "#8175CB"
        secondary_accent_color = "#6D819F"

        secondary_font_color = "#DAEBFF"
        snow_opacity = ".8"
        m_back = "#DBCEEC"
        m_front = "#8999E1"
    }
    // snowy afternoon
    if (weather_type == "snowy_afternoon") {
        primary_color = "#D7ECFE"
        primary_accent_color = "#85C2E7"
        secondary_accent_color = "#648CC4"
        primary_font_color = "#48658C"
        playback_color = "white"
        snow_opacity = ".9"
        m_back = "#E5FDFF"
        m_front = "#9ABEDE"

    }
    // snowy evening
    if (weather_type == "snowy_evening") {
        primary_color = "#8EA3DC"
        primary_accent_color = "#7892E3"
        secondary_accent_color = "#6E82B4"
        snow_opacity = ".8"
        m_back = "#897EA9"
        m_front = "#5E70A6"
    }

    // weather_type = "snowy_night"

    // snowy night
    if (weather_type == "snowy_night") {
        primary_color = "#252D3D"
        primary_accent_color = "#8095B7"
        secondary_accent_color = "#1E242F"
        primary_font_color = "#DAE1EB"
        secondary_font_color = "#8492A9"
        snow_opacity = ".5"
        m_back = "#445360"
        m_front = "#2B364F"
    }

    

    // rainy morning
    if (weather_type == "rainy_morning") {
        primary_color = "#485060"
        primary_accent_color = "#768B9E"
        secondary_accent_color = "#091A24"

        m_back = "#3E4347"
        m_front = "#2F3840"

        rain_opacity = ".3"
    }
    // rainy afternoon
    if (weather_type == "rainy_afternoon") {
        primary_color = "#485B60"
        primary_accent_color = "#565B61"
        secondary_accent_color = "#213638"

        m_back = "#3D585E"
        m_front = "#405051"

        rain_opacity = ".3"
    }
    // rainy evening
    if (weather_type == "rainy_evening") {
        primary_color = "#536770"
        primary_accent_color = "#5B7F90"
        secondary_accent_color = "#242C31"

        m_back = "#3E4347"
        m_front = "#2F3840"

        rain_opacity = ".3"
    }
    // rainy night
    if (weather_type == "rainy_night") {
        primary_color = "#28333D"
        primary_accent_color = "#6783A2"
        secondary_accent_color = "#1C222A"
        secondary_font_color = "#6783A2"

        m_back = "#2B3846"
        m_front = "#212B36"

        rain_opacity = ".3"
    }

    

    // stormy morning
    if (weather_type == "stormy_morning") {
        primary_color = "#2C3947"
        primary_accent_color = "#768B9E"
        secondary_accent_color = "#091A24"

        flash_length = "12s"
        rain_opacity = ".3"

        m_back = "#202A33"
        m_front = "#2D3134"
    }
    // stormy afternoon
    if (weather_type == "stormy_afternoon") {
        primary_color = "#414E56"
        primary_accent_color = "#748B81"
        secondary_accent_color = "#132A3B"

        flash_length = "12s"
        rain_opacity = ".3"

        m_back = "#3E4347"
        m_front = "#2F3840"

        
    }
    // stormy evening
    if (weather_type == "stormy_evening") {
        primary_color = "#484E5A"
        primary_accent_color = "#6A485C"
        secondary_accent_color = "#242C31"

        flash_length = "12s"
        rain_opacity = ".3"

        m_back = "#30373E"
        m_front = "#22292F"
        
    }
    // stormy night
    if (weather_type == "stormy_night") {
        primary_color = "#292F3D"
        primary_accent_color = "#5E4D80"
        secondary_accent_color = "#231E2A"

        flash_length = "12s"
        rain_opacity = ".3"

        m_back = "#12181D"
        m_front = "#1D252C"
    }

    // update theme if changed
    if (weather_type != prev_type) {
        prev_type = weather_type
        // console.log("Transitioning!");
        granimInstance.changeState(weather_type)
        gsap.to('html',
            {
                duration: 1,
                '--primary-color': primary_color,
                '--primary-accent-color': primary_accent_color,
                '--secondary-accent-color': secondary_accent_color,
                '--primary-font-color': primary_font_color,
                '--secondary-font-color': secondary_font_color,
                '--playback-color': playback_color,
                '--flash-length': flash_length,
                '--m-front': m_front,
                '--m-back': m_back,
                '--rain-opacity': rain_opacity,
                '--snow-opacity': snow_opacity
            }
        )
        gsap.to('#star-container', 
            {
                duration: 1,
                opacity: star_opacity
            }
        )
    }
}

updateTheme(icon.innerHTML, period.innerHTML)
