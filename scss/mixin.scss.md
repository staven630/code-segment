
/* 清浮动 */
@mixin clearfix() {
  *zoom: 1;
  &:before, &:after {
    content: '';
    display: table;
  }
  &:after {
    clear: both;
    overflow: hidden;
  }
}

/* 单行文本溢出 */
@mixin text-ellipsis() {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 多行文本溢出 */
@mixin multiple-text-ellipsis($line) {
    display: -webkit-box;
    overflow : hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: $line;
    -webkit-box-orient: vertical;
}

/* 边框圆角 */
@mixin border-radius($radius) {
    -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
          border-radius: $radius;
}

@mixin retina($image, $extension, $width, $height, $position: center, $repeat: no-repeat) {
     background: url($image + '.' + $extension) $repeat $position;
     @media 
     screen and (-webkit-min-device-pixel-ratio: 2),
     screen and (   min--moz-device-pixel-ratio: 2),
     screen and (   -moz-min-device-pixel-ratio: 2),
     screen and (     -o-min-device-pixel-ratio: 2/1),
     screen and (        min-device-pixel-ratio: 2),
     screen and (             min-resolution: 192dpi), 
     screen and (             min-resolution: 2dppx) {    
        background: url($image + '@2x' + '.' + $extension) $repeat $position;
        background-size: $width $height;
     }
}