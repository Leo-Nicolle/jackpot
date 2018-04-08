uniform float time;
uniform vec2 resolution;

//SpriteBatch will use texture unit 0
uniform sampler2D texture;
//
// //"in" varyings from our vertex shader
// varying vec4 vColor;
varying vec2 vTexCoord;

void main()	{
	gl_FragColor = vec4(abs(sin(time/1000.)),0.,0., 1.);

	vec2 texCoord = vTexCoord;
	if (texCoord.x > 0.5) {
		texCoord.x = 1. - texCoord.x;
	}
	if (texCoord.y > 0.5) {
		texCoord.y = 1. - texCoord.y;
	}

	vec4 texColor = texture2D(texture, texCoord);

	gl_FragColor = vec4(texColor.rgb, 1);
    //
	// //invert the red, green and blue channels
	// texColor.rgb = 1.0 - texColor.rgb;
    //
	// //final color
	// gl_FragColor = vColor * texColor;
}
