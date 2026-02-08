import { IconProvider, ToastProvider, ThemeProvider, DataThemeProvider, type BorderStyle, type NeutralColor, type ScalingSize, type Schemes, type SolidStyle, type SolidType, type SurfaceStyle, type TransitionStyle, type ChartVariant, type ChartMode } from "@once-ui-system/core";
import { iconLibrary } from "./resources/icons";
import { style } from "./resources";
import { dataConfig } from "./resources/config";

export function Providers({ children }: {
    children: React.ReactNode
}) {
    return (
        <ThemeProvider
            theme="system"
            neutral={style.neutral as NeutralColor}
            brand={style.brand as Schemes}
            accent={style.accent as Schemes}
            solid={style.solid as SolidType}
            solidStyle={style.solidStyle as SolidStyle}
            border={style.border as BorderStyle}
            surface={style.surface as SurfaceStyle}
            transition={style.transition as TransitionStyle}
            scaling={style.scaling as ScalingSize}
        >
            <DataThemeProvider
                variant={dataConfig.variant as ChartVariant } // flat | gradient | outline
                mode={dataConfig.mode as ChartMode} // categorical | divergent | sequential
                height={dataConfig.height} // default chart height
                axis={{
                    stroke: dataConfig.axisLine.stroke
                }}
                tick={{
                    fill: dataConfig.tick.fill,
                    fontSize: dataConfig.tick.fontSize,
                    line: dataConfig.tickLine
                }}>
                <ToastProvider>
                    <IconProvider icons={iconLibrary}>
                        {children}
                    </IconProvider>
                </ToastProvider>
            </DataThemeProvider>
        </ThemeProvider>
    );
}