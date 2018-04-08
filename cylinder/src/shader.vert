uniform float time;
uniform vec2 resolution;

varying vec2 vTexCoord;

void main()	{
	gl_Position = vec4( position, 1.0 );
	vTexCoord = (position.xy + 1.) / 2.;
}
