import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './InfoBox.css'

function InfoBox({ title, cases, active, isRed, isOrange, isCases, isDeath, total, ...props }) {
    return (
        <Card onClick={props.onClick}  className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red"
          } ${isOrange && "infoBox--deaths"}`}>
            <CardContent>
                {/* Title */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                {/* Number of cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"} ${!isCases && "infobox--cases"} ${isDeath && "infobox--isdeath"}`}>{cases}</h2>

                {/* Total */}
                <Typography className="infoBox__total" color = "textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
